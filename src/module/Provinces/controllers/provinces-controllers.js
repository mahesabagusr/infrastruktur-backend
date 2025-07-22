import * as wrapper from '@/helpers/utils/wrapper.js';
import {
  ERROR as httpError,
  SUCCESS as http,
} from '@/helpers/http-status/status_code.js'
// import { isValidPayload } from '@/helpers/utils/validator.js';
import ProvinceService from '@/module/Provinces/services/provinces-services.js';

const getAllProvinces = async (req, res) => {

  const postRequest = () => {
    return ProvinceService.getAllProvinces();
  };

  const sendResponse = async (result) => {
    result.err
      ? wrapper.response(
        res,
        'fail',
        result,
        'Failed to retrieve provinces',
        httpError.NOT_FOUND
      )
      : wrapper.response(res, 'success', result, 'Provinces retrieved successfully', http.OK);
  };

  await sendResponse(await postRequest());
}

const getAllRegencies = async (req, res) => {
  const postRequest = () => {
    return ProvinceService.getAllRegencies();
  };

  const sendResponse = async (result) => {
    result.err
      ? wrapper.response(
        res,
        'fail',
        result,
        'Failed to retrieve regencies',
        httpError.NOT_FOUND
      )
      : wrapper.response(res, 'success', result, 'Regencies retrieved successfully', http.OK);
  };

  await sendResponse(await postRequest());
}

export { getAllProvinces, getAllRegencies };