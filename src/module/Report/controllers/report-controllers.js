import * as wrapper from '@/helpers/utils/wrapper.js';
import {
  ERROR as httpError,
  SUCCESS as http,
} from '@/helpers/http-status/status_code.js'
import { isValidPayload } from '@/helpers/utils/validator.js';
import { reportModel } from '@/module/Report/models/report-models.js';
import ReportService from '@/module/Report/services/report-services.js';
import logger from '@/helpers/utils/logger.js';
import { BadRequestError } from '@/helpers/error/index.js';

const addReport = async (req, res) => {
  try {
    const payload = { ...req.body, email: req.email };

    if (!req.file) {
      return wrapper.response(
        res,
        "fail",
        { err: new BadRequestError("File gambar diperlukan") },
        httpError.BAD_REQUEST
      );
    }

    const validatePayload = await isValidPayload(payload, reportModel);

    if (validatePayload.err) {
      return wrapper.response(
        res,
        "fail",
        { err: validatePayload.err, data: null },
        "Invalid Payload",
        httpError.EXPECTATION_FAILED
      );
    }

    const postRequest = async (data) => {
      return await ReportService.addReport(data)
    }

    const sendResponse = async (result) => {
      console.log(result);
      result.err
        ? wrapper.response(
          res,
          "fail",
          result,
          "Gagal menambahkan laporan",
          httpError.NOT_FOUND
        )
        : wrapper.response(
          res,
          "success",
          result,
          "Berhasil menambahkan laporan",
          http.CREATED
        );
    }

    return sendResponse(await postRequest({ ...validatePayload.data, image: req.file.buffer }));

  } catch (err) {

    logger.error(`Unexpected error during upload Report: ${err.message}`);

    return wrapper.response(
      res,
      "fail",
      { err: err.message, data: null },
      "An unexpected error occurred",
      httpError.INTERNAL_ERROR
    );
  }
}

export { addReport };