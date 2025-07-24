import express from 'express';
import { userRegister, userLogin } from '@/module/User/controllers/users-controllers.js';
import { getAllProvinces, getAllRegencies, getRegenciesByProvincesId } from '@/module/Provinces/controllers/provinces-controllers.js';
import { addReport, addReportProgress } from '@/module/Report/controllers/report-controllers.js';
import { verifyToken } from '@/middlewares/jwt-auth.js';
import { basicAuth } from '@/middlewares/basic-auth';
import upload from '@/helpers/utils/multer.js';

const router = express.Router();

router.get('/', function (req, res) {
  res.status(200).json({ status: 'OK' });
});

router.post('/user/register', userRegister);
router.post('/user/login', userLogin);

router.get('/provinces/getAll', getAllProvinces);
router.get('/regencies/getAll', getAllRegencies);
router.post('/regencies/getByProvinceId/:id', getRegenciesByProvincesId);

router.post('/report/add', verifyToken, upload.single('photo'), addReport);
router.post('/report/addProgress', verifyToken, basicAuth, upload.single('photo'), addReportProgress);
export default router;