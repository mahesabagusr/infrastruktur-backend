import express from 'express';
import { userRegister, userLogin } from '@/module/User/controllers/users-controllers.js';
import { getAllProvinces, getAllRegencies, getRegenciesByProvincesId } from '@/module/Provinces/controllers/provinces-controllers.js';
import { addReport } from '@/module/Report/controllers/report-controllers.js';
import { verifyToken } from '@/middlewares/jwt_auth.js';
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
export default router;