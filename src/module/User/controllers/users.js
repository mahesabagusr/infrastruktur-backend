import * as wrapper from '../../../helpers/utils/wrapper.js';
import {
  ERROR as httpError,
  SUCCESS as http,
} from '../../../helpers/http-status/status_code.js'
import UserService from '../services/users.js';
import validator from '../../../helpers/utils/validator.js'
import { loginModel, registerModel } from '../models/users-model.js'


const userRegister = async (req, res) => {
  const validatePayload = validator.isValidPayload(
    req.body,
    registerModel
  )

  const postRequest = (result) => {
    if (!result) {
      return result
    }
    return UserService.register(result.data)
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

  await sendResponse(await postRequest(validatePayload));
};

const userLogin = async (req, res) => {
  const validatePayload = validator.isValidPayload(
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