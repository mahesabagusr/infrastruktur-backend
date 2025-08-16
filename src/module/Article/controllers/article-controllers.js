import * as wrapper from '@/helpers/utils/wrapper.js';
import {
  ERROR as httpError,
  SUCCESS as http,
} from '@/helpers/http-status/status_code.js';
import { isValidPayload } from '@/helpers/utils/validator.js';
import { articleModel } from '@/module/Article/models/article-models.js';
import ArticleService from '@/module/Article/services/article-services.js';
import logger from '@/helpers/utils/logger.js';
import { BadRequestError } from '@/helpers/error/index.js';

// Create Article
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

// Update Article
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

// Delete Article
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

// Get Article by ID
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

// Get Articles by Category
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

// Get Articles by Title
const getArticlesByTitle = async (req, res) => {
  try {
    const { title } = req.query;
    const articles = await ArticleService.getArticlesByTitle(title);
    if (articles.err) {
      return wrapper.response(
        res,
        "fail",
        articles,
        "Gagal mendapatkan artikel berdasarkan judul",
        httpError.NOT_FOUND
      );
    }
    return wrapper.response(
      res,
      "success",
      articles,
      "Berhasil mendapatkan artikel berdasarkan judul",
      http.OK
    );
  } catch (err) {
    logger.error(`Unexpected error during getArticlesByTitle: ${err.message}`);
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
  updateArticle,
  deleteArticle,
  getArticleById,
  getAllArticlesByCategory,
  getArticlesByTitle
};
