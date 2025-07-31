import express from 'express';
import { userRegister, userLogin } from '@/module/User/controllers/users-controllers.js';
import { getAllProvinces, getAllRegencies, getRegenciesByProvincesId } from '@/module/Provinces/controllers/provinces-controllers.js';
import { addReport, getAllReport, getAllReportsByProvince, verifyReport } from '@/module/Report/controllers/report-controllers.js';
import { verifyToken } from '@/middlewares/jwt-auth.js';
import { basicAuth } from '@/middlewares/basic-auth.js';
import upload from '@/helpers/utils/multer.js';

const router = express.Router();

router.get('/', function (req, res) {
  res.status(200).json({ status: 'OK' });
});

router.post('/user/register', userRegister);
router.post('/user/login', userLogin);

router.get('/provinces', getAllProvinces);
router.get('/regencies', getAllRegencies);
router.get('/provinces/:id/regencies', getRegenciesByProvincesId);

router.post('/report', verifyToken, upload.single('photo'), addReport);
router.post('/report/verify/:reportId', verifyToken, basicAuth, upload.single('photo'), verifyReport);
router.get('/report', verifyToken, getAllReport)
router.get('/report/:provinceId', verifyToken, getAllReportsByProvince);

export default router;