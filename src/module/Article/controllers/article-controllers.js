import * as wrapper from '@/helpers/utils/wrapper.js';
import {
  ERROR as httpError,
  SUCCESS as http,
} from '@/helpers/http-status/status_code.js';
import { isValidPayload } from '@/helpers/utils/validator.js';
import { createArticleSchema, articleModel, verifyArticleModel } from '@/module/Article/models/article-models.js';
import ArticleService from '@/module/Article/services/article-services.js';
import logger from '@/helpers/utils/logger.js';
import { BadRequestError } from '@/helpers/error/index.js';

const updateArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const validatePayload = isValidPayload(req.body, articleModel);

    if (validatePayload.err) {
      return wrapper.response(
        res,
        "fail",
        { err: validatePayload.err, data: null },
        "Invalid Payload",
        httpError.EXPECTATION_FAILED
      );
    }

    const payload = {
      ...validatePayload.data,
      email: req.email,
      image: req.file ? req.file.buffer : undefined,
      articleId
    };

    const result = await ArticleService.updateArticle(payload);

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Gagal memperbarui artikel",
        httpError.NOT_FOUND
      );
    }

    return wrapper.response(
      res,
      "success",
      result,
      "Berhasil memperbarui artikel",
      http.OK
    );
  } catch (err) {
    logger.error(`Unexpected error during updateArticle: ${err.message}`);

    return wrapper.response(
      res,
      "fail",
      { err: err.message, data: null },
      "An unexpected error occurred",
      httpError.INTERNAL_ERROR
    );
  }
};

const deleteArticle = async (req, res) => {
  try {
    const { articleId } = req.params;

    const result = await ArticleService.deleteArticle(articleId);

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Gagal menghapus artikel",
        httpError.NOT_FOUND
      );
    }

    return wrapper.response(
      res,
      "success",
      result,
      "Berhasil menghapus artikel",
      http.OK
    );
  } catch (err) {
    logger.error(`Unexpected error during deleteArticle: ${err.message}`);

    return wrapper.response(
      res,
      "fail",
      { err: err.message, data: null },
      "An unexpected error occurred",
      httpError.INTERNAL_ERROR
    );
  }
};
const addArticle = async (req, res) => {
  try {
    if (!req.file) {
      return wrapper.response(
        res,
        "fail",
        { err: new BadRequestError("File gambar diperlukan") },
        httpError.BAD_REQUEST
      );
    }

    // Use articleModel for validation
    const validatePayload = isValidPayload(req.body, articleModel);

    if (validatePayload.err) {
      return wrapper.response(
        res,
        "fail",
        { err: validatePayload.err, data: null },
        "Invalid Payload",
        httpError.EXPECTATION_FAILED
      );
    }

    // Ensure image is a buffer, as required by backend logic
    const payload = {
      ...validatePayload.data,
      email: req.email,
      image: req.file.buffer
    };

    const result = await ArticleService.addArticle(payload);

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Gagal menambahkan artikel",
        httpError.NOT_FOUND
      );
    }

    return wrapper.response(
      res,
      "success",
      result,
      "Berhasil menambahkan artikel",
      http.CREATED
    );
  } catch (err) {
    logger.error(`Unexpected error during addArticle: ${err.message}`);

    return wrapper.response(
      res,
      "fail",
      { err: err.message, data: null },
      "An unexpected error occurred",
      httpError.INTERNAL_ERROR
    );
  }
};

const verifyArticle = async (req, res) => {
  try {
    const validatePayload = isValidPayload(req.body, verifyArticleModel);

    if (validatePayload.err) {
      return wrapper.response(
        res,
        "fail",
        { err: validatePayload.err, data: null },
        "Invalid Payload",
        httpError.EXPECTATION_FAILED
      );
    }

    const payload = { ...validatePayload.data, articleId: req.params.articleId, email: req.email };

    const postRequest = async (data) => {
      return await ArticleService.verifyArticle(data);
    };

    const result = await postRequest(payload);

    if (result.err) {
      return wrapper.response(
        res,
        "fail",
        result,
        "Gagal memverifikasi artikel",
        httpError.NOT_FOUND
      );
    } else {
      return wrapper.response(
        res,
        "success",
        result,
        "Berhasil memverifikasi artikel",
        http.OK
      );
    }
  } catch (err) {
    logger.error(`Unexpected error during verifyArticle: ${err.message}`);

    return wrapper.response(
      res,
      "fail",
      { err: err.message, data: null },
      "An unexpected error occurred",
      httpError.INTERNAL_ERROR
    );
  }
};

const addArticleProgress = async (req, res) => {
  try {
    if (!req.file) {
      return wrapper.response(
        res,
        "fail",
        { err: new BadRequestError("File gambar diperlukan") },
        httpError.BAD_REQUEST
      );
    }

    const validatePayload = isValidPayload(req.body, createArticleSchema);

    if (validatePayload.err) {
      return wrapper.response(
        res,
        "fail",
        { err: validatePayload.err, data: null },
        "Invalid Payload",
        httpError.EXPECTATION_FAILED
      );
    }

    const { articleId } = req.params;

    const payload = { ...validatePayload.data, email: req.email, image: req.file.buffer, articleId };

    const postRequest = async (data) => {
      return await ArticleService.addArticleProgress(data);
    };

    const sendResponse = async (result) => {
      result.err
        ? wrapper.response(
          res,
          "fail",
          result,
          "Gagal menambahkan progress artikel",
          httpError.NOT_FOUND
        )
        : wrapper.response(
          res,
          "success",
          result,
          "Berhasil menambahkan progress artikel",
          http.CREATED
        );
    };

    return sendResponse(await postRequest(payload));
  } catch (err) {
    logger.error(`Unexpected error during addArticleProgress: ${err.message}`);

    return wrapper.response(
      res,
      "fail",
      { err: err.message, data: null },
      "An unexpected error occurred",
      httpError.INTERNAL_ERROR
    );
  }
};

const getAllArticle = async (res) => {
  try {
    const articles = await ArticleService.getAllArticle();

    if (articles.err) {
      return wrapper.response(
        res,
        "fail",
        articles,
        "Gagal mendapatkan artikel",
        httpError.NOT_FOUND
      );
    }

    return wrapper.response(
      res,
      "success",
      articles,
      "Berhasil mendapatkan artikel",
      http.OK
    );
  } catch (err) {
    logger.error(`Unexpected error during getAllArticle: ${err.message}`);

    return wrapper.response(
      res,
      "fail",
      { err: err.message, data: null },
      "An unexpected error occurred",
      httpError.INTERNAL_ERROR
    );
  }
};

const getAllArticlesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const articles = await ArticleService.getAllArticlesByCategory(categoryId);

    if (articles.err) {
      return wrapper.response(
        res,
        "fail",
        articles,
        "Gagal mendapatkan artikel berdasarkan kategori",
        httpError.NOT_FOUND
      );
    }

    return wrapper.response(
      res,
      "success",
      articles,
      "Berhasil mendapatkan artikel berdasarkan kategori",
      http.OK
    );
  } catch (err) {
    logger.error(`Unexpected error during getAllArticlesByCategory: ${err.message}`);

    return wrapper.response(
      res,
      "fail",
      { err: err.message, data: null },
      "An unexpected error occurred",
      httpError.INTERNAL_ERROR
    );
  }
};

const getArticleById = async (req, res) => {
  try {
    const { articleId } = req.params;

    const article = await ArticleService.getArticleById(articleId);

    if (article.err) {
      return wrapper.response(
        res,
        "fail",
        article,
        "Gagal mendapatkan artikel",
        httpError.NOT_FOUND
      );
    }

    return wrapper.response(
      res,
      "success",
      article,
      "Berhasil mendapatkan artikel",
      http.OK
    );
  } catch (err) {
    return wrapper.response(
      res,
      "fail",
      { err: err.message, data: null },
      "An unexpected error occurred",
      httpError.INTERNAL_ERROR
    );
  }
};

export {
  addArticle,
  addArticleProgress,
  verifyArticle,
  getAllArticle,
  getAllArticlesByCategory,
  getArticleById
};
