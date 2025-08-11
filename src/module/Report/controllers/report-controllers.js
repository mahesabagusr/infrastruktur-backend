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
        "File gambar diperlukan",
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

    const payload = { ...validatePayload.data, email: req.user.email, image: req.file.buffer };

    const result = await ReportService.addReport(payload);

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Gagal menambahkan laporan",
        httpError.NOT_FOUND
      );
    }

    return wrapper.response(
      res,
      "success",
      result,
      "Berhasil menambahkan laporan",
      http.CREATED
    );

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
    const validatePayload = isValidPayload(req.body, verifyReportModel);

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

    const result = await ReportService.verifyReport(payload);

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Gagal memverifikasi laporan",
        httpError.NOT_FOUND
      );
    }

    return wrapper.response(
      res,
      "success",
      result,
      "Berhasil memverifikasi laporan",
      http.OK
    );

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
        "File gambar diperlukan",
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

    const { reportId } = req.params;
    const payload = { ...validatePayload.data, email: req.user.email, image: req.file.buffer, reportId };

    const result = await ReportService.addReportProgress(payload);

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Gagal menambahkan progress laporan",
        httpError.NOT_FOUND
      );
    }

    return wrapper.response(
      res,
      "success",
      result,
      "Berhasil menambahkan progress laporan",
      http.CREATED
    );

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

const getAllReport = async (req, res) => {
  try {
    const result = await ReportService.getAllReport();

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Gagal mendapatkan laporan",
        httpError.NOT_FOUND
      );
    }

    return wrapper.response(
      res,
      "success",
      result,
      "Berhasil mendapatkan laporan",
      http.OK
    );

  } catch (err) {
    logger.error(`Unexpected error during getAllReport: ${err.message}`);
    return wrapper.response(
      res,
      "fail",
      { err: err.message, data: null },
      "An unexpected error occurred",
      httpError.INTERNAL_ERROR
    );
  }
}

const getAllReportsByProvince = async (req, res) => {
  try {
    const { provinceId } = req.params;
    const result = await ReportService.getAllReportsByProvince(provinceId);

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Gagal mendapatkan laporan berdasarkan provinsi",
        httpError.NOT_FOUND
      );
    }

    return wrapper.response(
      res,
      "success",
      result,
      "Berhasil mendapatkan laporan berdasarkan provinsi",
      http.OK
    );

  } catch (err) {
    logger.error(`Unexpected error during getAllReportsByProvince: ${err.message}`);
    return wrapper.response(
      res,
      "fail",
      { err: err.message, data: null },
      "An unexpected error occurred",
      httpError.INTERNAL_ERROR
    );
  }
}

const getReportById = async (req, res) => {
  try {
    const { reportId } = req.params;
    const result = await ReportService.getReportById(reportId);

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Gagal mendapatkan laporan",
        httpError.NOT_FOUND
      );
    }

    return wrapper.response(
      res,
      "success",
      result,
      "Berhasil mendapatkan laporan",
      http.OK
    );

  } catch (err) {
    logger.error(`Unexpected error during getReportById: ${err.message}`);
    return wrapper.response(
      res,
      "fail",
      { err: err.message, data: null },
      "An unexpected error occurred",
      httpError.INTERNAL_ERROR 
    );
  }
}

export { addReport, addReportProgress, verifyReport, getAllReport, getAllReportsByProvince, getReportById };