import * as wrapper from '@/helpers/utils/wrapper.js';
import {
  ERROR as httpError,
  SUCCESS as http,
} from '@/helpers/http-status/status_code.js'
import { isValidPayload } from '@/helpers/utils/validator.js';
import { createReportProgressSchema, reportModel, verifyReportModel } from '@/module/Report/models/report-models.js';
import ReportService from '@/module/Report/services/report-services.js';
import logger from '@/helpers/utils/logger.js';
import { BadRequestError } from '@/helpers/error/index.js';

const addReport = async (req, res) => {
  try {
    if (!req.file) {
      return wrapper.response(
        res,
        "fail",
        { err: new BadRequestError("File gambar diperlukan") },
        httpError.BAD_REQUEST
      );
    }

    const validatePayload = await isValidPayload(req.body, reportModel);

    if (validatePayload.err) {
      return wrapper.response(
        res,
        "fail",
        { err: validatePayload.err, data: null },
        "Invalid Payload",
        httpError.EXPECTATION_FAILED
      );
    }

    const payload = { ...validatePayload.data, email: req.email, image: req.file.buffer };

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

    return sendResponse(await postRequest(payload));

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

const verifyReport = async (req, res) => {
  try {

    const validatePayload = isValidPayload(payload, verifyReportModel);

    if (validatePayload.err) {
      return wrapper.response(
        res,
        "fail",
        { err: validatePayload.err, data: null },
        "Invalid Payload",
        httpError.EXPECTATION_FAILED
      );
    }

    const payload = { ...validatePayload.data, reportId: req.params.reportId, email: req.email };

    const postRequest = async (data) => {
      return await ReportService.verifyReport(data);
    }

    const result = await postRequest(validatePayload.data);

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Gagal memverifikasi laporan",
        httpError.NOT_FOUND
      );
    } else {
      return wrapper.response(
        res,
        "success",
        result,
        "Berhasil memverifikasi laporan",
        http.OK
      );
    }
  } catch (err) {
    logger.error(`Unexpected error during verifyReport: ${err.message}`);

    return wrapper.response(
      res,
      "fail",
      { err: err.message, data: null },
      "An unexpected error occurred",
      httpError.INTERNAL_ERROR
    );
  }
}
const addReportProgress = async (req, res) => {
  try {
    if (!req.file) {
      return wrapper.response(
        res,
        "fail",
        { err: new BadRequestError("File gambar diperlukan") },
        httpError.BAD_REQUEST
      );
    }

    const validatePayload = await isValidPayload(req.body, createReportProgressSchema);

    if (validatePayload.err) {
      return wrapper.response(
        res,
        "fail",
        { err: validatePayload.err, data: null },
        "Invalid Payload",
        httpError.EXPECTATION_FAILED
      );
    }

    const { reportId } = req.params

    const payload = { ...validatePayload.data, email: req.email, image: req.file.buffer, reportId };

    const postRequest = async (data) => {
      return await ReportService.addReportProgress(data)
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

    return sendResponse(await postRequest(payload));

  } catch (err) {
    logger.error(`Unexpected error during addReportProgress: ${err.message}`);

    return wrapper.response(
      res,
      "fail",
      { err: err.message, data: null },
      "An unexpected error occurred",
      httpError.INTERNAL_ERROR
    );
  }
}

export { addReport, addReportProgress, verifyReport };