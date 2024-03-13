import express from "express";
const router = express.Router();
import * as emergencyController from '../controller/emergency.js'

// 순서대로 실행
router.get('/setErBase', emergencyController.getErList)
router.get('/setErInfo', emergencyController.getErInfo)
router.get('/setSaltCode', emergencyController.getSaltCode)
router.get('/setSpecialEr', emergencyController.getSpecialEr)
router.get('/setEquipment', emergencyController.getEquipment)
// router.post('/getRealTime', emergencyController.getErWithRealTime)


export default router;
