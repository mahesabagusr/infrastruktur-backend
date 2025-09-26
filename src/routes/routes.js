import express from 'express';
import { userRegister, userLogin, refreshToken, userLogout, getUserById, getUser } from '@/module/User/controllers/users-controllers.js';
import { getAllProvinces, getAllRegencies, getRegenciesByProvincesId } from '@/module/Provinces/controllers/provinces-controllers.js';
import { addReport, addReportProgress, getAllReport, getAllReportsByProvince, verifyReport, getReportProgressById, getReportById } from '@/module/Report/controllers/report-controllers.js';
import { verifyToken } from '@/middlewares/jwt-auth.js';
import { basicAuth } from '@/middlewares/basic-auth.js';
import { acceptImageFields, normalizeSingleFile } from '@/helpers/utils/multer.js';
import { createLike, deleteLike } from '@/module/Likes/like.controller.js';
import { createComment, deleteComment } from '@/module/comments/comment.controller.js';

const router = express.Router();

router.get('/', function (req, res) {
  res.status(200).json({ status: 'OK' });
});

router.post('/user/register', userRegister);
router.post('/user/login', userLogin);
router.post('/user/refreshToken', refreshToken)
router.post('/user/logout', verifyToken, userLogout)
router.get('/user/:userId', verifyToken, getUserById)
router.get('/user', verifyToken, getUser)

router.get('/provinces', getAllProvinces);
router.get('/regencies', getAllRegencies);
router.get('/provinces/:id/regencies', getRegenciesByProvincesId);

router.post('/report', verifyToken, acceptImageFields, normalizeSingleFile, addReport);
router.post('/report/:reportId/progress', verifyToken, basicAuth, acceptImageFields, normalizeSingleFile, addReportProgress);
router.patch('/report/:reportId/verify', verifyToken, basicAuth, verifyReport);
router.get('/report', getAllReport);
router.get('/report/:progressId/progress', verifyToken, basicAuth, getReportProgressById);
router.get('/report/:provinceId', verifyToken, getAllReportsByProvince);


router.post('/report/like', verifyToken, createLike);
router.delete('/report/like/:id', verifyToken, deleteLike);

router.post('/report/comment', verifyToken, createComment);
router.delete('/report/comment/:id', verifyToken, deleteComment);

router.get('/report/:reportId', getReportById);


export default router;