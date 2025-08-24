import express from 'express';
import { userRegister, userLogin, refreshToken, userLogout, getUserById, getUser } from '@/module/User/controllers/users-controllers.js';
import { getAllProvinces, getAllRegencies, getRegenciesByProvincesId } from '@/module/Provinces/controllers/provinces-controllers.js';
import { addReport, addReportProgress, getAllReport, getAllReportsByProvince, verifyReport, getReportProgressById } from '@/module/Report/controllers/report-controllers.js';
import { verifyToken } from '@/middlewares/jwt-auth.js';
import { basicAuth } from '@/middlewares/basic-auth.js';
import upload from '@/helpers/utils/multer.js';

const router = express.Router();

router.get('/', function (req, res) {
  res.status(200).json({ status: 'OK' });
});

router.post('/user/register', userRegister);
router.post('/user/login', userLogin);
router.post('/user/refreshToken', verifyReport, refreshToken)
router.post('/user/logout', verifyReport, userLogout)
router.get('/user/:userId', verifyToken, getUserById)
router.get('/user', verifyToken, getUser)


router.get('/provinces', getAllProvinces);
router.get('/regencies', getAllRegencies);
router.get('/provinces/:id/regencies', getRegenciesByProvincesId);


router.post('/report', verifyToken, upload.single('photo'), addReport);
router.post('/report/:reportId/progress', verifyToken, basicAuth, upload.single('photo'), addReportProgress);
router.patch('/report/:reportId/verify', verifyToken, basicAuth, verifyReport);
router.get('/report', getAllReport)
router.get('/report/:provinceId', verifyToken, getAllReportsByProvince);
router.get('/report/:progressId/progress', verifyToken, basicAuth, getReportProgressById);


export default router;