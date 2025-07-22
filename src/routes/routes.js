import express from 'express';
import { userRegister, userLogin } from '@/module/User/controllers/users-controllers.js';
import { getAllProvinces, getAllRegencies } from '@/module/Provinces/controllers/provinces-controllers.js';

const router = express.Router();

router.get('/', function (req, res) {
  res.status(200).json({ status: 'OK' });
});

router.post('/user/register', userRegister);
router.post('/user/login', userLogin);

router.get('/provinces/getAll', getAllProvinces);
router.get('/regencies/getAll', getAllRegencies);

export default router;