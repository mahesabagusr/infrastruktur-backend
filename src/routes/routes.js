import express from 'express';
import { userRegister, userLogin, refreshToken, userLogout } from '@/module/User/controllers/users-controllers.js';
import { getAllProvinces, getAllRegencies, getRegenciesByProvincesId } from '@/module/Provinces/controllers/provinces-controllers.js';
import { addReport, addReportProgress, getAllReport, getAllReportByProgress, getAllReportsByProvince, verifyReport } from '@/module/Report/controllers/report-controllers.js';
import { verifyToken } from '@/middlewares/jwt-auth.js';
import { basicAuth } from '@/middlewares/basic-auth.js';
import upload from '@/helpers/utils/multer.js';

const router = express.Router();

router.get('/', function (req, res) {
  res.status(200).json({ status: 'OK' });
});

router.post('/user/register', userRegister);
router.post('/user/login', userLogin);
router.post('/user/refreshToken', refreshToken)
router.post('/user/logout', userLogout)


router.get('/provinces', getAllProvinces);
router.get('/regencies', getAllRegencies);
router.get('/provinces/:id/regencies', getRegenciesByProvincesId);

router.get('/report/progress', verifyToken, getAllReportByProgress)
router.post('/report', verifyToken, upload.single('photo'), addReport);
router.post('/report/:reportId/progress', verifyToken, basicAuth, upload.single('photo'), addReportProgress);
router.patch('/report/:reportId/verify', verifyToken, basicAuth, verifyReport);
router.get('/report', verifyToken, getAllReport)
router.get('/report/:provinceId', verifyToken, getAllReportsByProvince);


export default router;