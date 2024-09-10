import * as wrapper from '../../../helpers/utils/wrapper.js';
import {
  ERROR as httpError,
  SUCCESS as http,
} from '../../../helpers/http-status/status_code.js'
import * as commandHandler from '../services/command/command_handler.js'
import validator from '../utils/validator.js'
import { registerModel } from '../models/user_model.js'


const userRegister = async (req, res) => {
  const validatePayload = validator.isValidPayload(
    req.body,
    registerModel
  )

  const postRequest = (result) => {
    if (!result) {
      return result
    }
    return commandHandler.userRegister(result.data)
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

export { userRegister };