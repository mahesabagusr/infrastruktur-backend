import * as wrapper from '@/helpers/utils/wrapper.js';
import {
  ERROR as httpError,
  SUCCESS as http,
} from '@/helpers/http-status/status_code.js'
import UserService from '@/module/User/services/users.js';
import { isValidPayload } from '@/helpers/utils/validator.js';
import { registerModel, loginModel } from '@/module/User/models/users-model.js';
import logger from '@/helpers/utils/logger.js';


const userRegister = async (req, res) => {
  try {
    const payload = { ...req.body };

    const validatePayload = await isValidPayload(payload, registerModel);

    if (validatePayload.err) {
      console.error("Validation error:", validatePayload.err);
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
      httpError.INTERNAL_SERVER_ERROR
    );
  }
};

const userLogin = async (req, res) => {
  const validatePayload = isValidPayload(
    req.body,
    loginModel
  )

  const postRequest = (result) => {
    if (!result) {
      return result
    }
    return UserService.login(result.data)
  }

  const sendResponse = async (result) => {
    result.err
      ? wrapper.response(
        res,
        'fail',
        result,
        'User Registration Failed',
        httpError.NOT_FOUND
      )
      : wrapper.response(res, 'success', result, 'User Registration Successfull', http.OK);
  }

  sendResponse(await postRequest(validatePayload));
};

export { userRegister, userLogin };