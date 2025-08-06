import * as wrapper from '@/helpers/utils/wrapper.js';
import {
  ERROR as httpError,
  SUCCESS as http,
} from '@/helpers/http-status/status_code.js'
import UserService from '@/module/User/services/users-controllers.js';
import { isValidPayload } from '@/helpers/utils/validator.js';
import { registerModel, loginModel } from '@/module/User/models/users-model.js';
import logger from '@/helpers/utils/logger.js';
import Unauthorized from '@/helpers/error/unauthorized_error';

const userRegister = async (req, res) => {
  try {
    const payload = { ...req.body };

    const validatePayload = await isValidPayload(payload, registerModel);

    if (validatePayload.err) {
      return wrapper.response(
        res,
        "fail",
        { err: validatePayload.err, data: null },
        "Invalid Payload",
        httpError.EXPECTATION_FAILED
      );
    }

    const postRequest = (data) => {
      return UserService.register(data);
    };

    const Response = (result) => {
      if (result.err) {
        wrapper.response(
          res,
          "fail",
          result,
          "User Registration Failed",
          httpError.NOT_FOUND
        );
      } else {
        wrapper.response(
          res,
          "success",
          result,
          "User Registration Successful",
          http.OK
        );
      }
    };

    Response(await postRequest(validatePayload.data));
  } catch (err) {
    let errorMessage = "An unexpected error occurred";
    if (err instanceof Error) {
      errorMessage = err.message;
    }

    logger.error(`Unexpected error during user registration: ${errorMessage}`);

    return wrapper.response(
      res,
      "fail",
      { err: errorMessage, data: null },
      "An unexpected error occurred",
      httpError.INTERNAL_ERROR
    );
  }
};

const userLogin = async (req, res) => {
  try {
    const payload = { ...req.body };
    const validatePayload = isValidPayload(payload, loginModel);

    if (validatePayload.err) {
      return wrapper.response(
        res,
        "fail",
        { err: validatePayload.err },
        "Invalid Payload",
        httpError.EXPECTATION_FAILED
      );
    }

    const result = await UserService.login(validatePayload.data);

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "User Login Failed",
        httpError.UNAUTHORIZED
      );
    }

    res.cookie("refreshToken", result.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return wrapper.response(
      res,
      "success",
      { accessToken: result.data.accessToken },
      "User Login Successful",
      http.OK
    );

  } catch (err) {
    logger.error(`Unexpected error during user Login: ${err.message}`);
    return wrapper.response(
      res,
      "fail",
      { err: err.message },
      "An unexpected error occurred",
      httpError.INTERNAL_ERROR
    );
  }
};

const refreshToken = async (req, res) => {
  try {
    const currentRefreshToken = req.cookies.refreshToken;

    if (!currentRefreshToken) {
      return wrapper.response(res, "fail", { err: new Unauthorized("Refresh token is required") }, "Unauthorized", httpError.UNAUTHORIZED);
    }

    const result = await UserService.refreshToken(currentRefreshToken);

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Failed to refresh token",
        httpError.UNAUTHORIZED
      );
    }

    return wrapper.response(res, "success", result.data, "Token refreshed successfully", http.OK);

  } catch (err) {
    logger.error(`Unexpected error during refresh token: ${err.message}`);

    return wrapper.response(
      res,
      "fail",
      { err: err.message, data: null },
      "An unexpected error occurred",
      httpError.INTERNAL_ERROR
    );
  }
}

const userLogout = async (req, res) => {
  try {
    const currentRefreshToken = req.cookies.refreshToken

    const result = await UserService.refreshToken(currentRefreshToken);

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result.err,
        "Failed to Logout",
        httpError.UNAUTHORIZED
      );
    }

    res.clearCookie('refreshToken')

    return wrapper.response(res, "success", null, "Logged out successfully", http.OK);

  } catch (err) {
    logger.error(`Unexpected error during user logout: ${err.message}`);
    return wrapper.response(
      res,
      "fail",
      { err: err.message },
      "An unexpected error occurred",
      httpError.INTERNAL_ERROR
    );
  }

}

export { userRegister, userLogin, refreshToken, userLogout };