import express from "express";
import * as pharmacyController from '../controller/pharmacy.js';


const router = express.Router();

// DB세팅
router.get('/settingDB', pharmacyController.setAllPharmacy);
// 주위 약국정보 가져오기
// router.post('/', pharmacyController.getAllPharmacy);

// 공휴일 약국 정보 가져오기
// router.get('/holiday', pharmacyController.getHolidayPharmacy);

export default router;
