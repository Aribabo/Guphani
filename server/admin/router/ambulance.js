import express from 'express';
import * as ambulance from '../controller/ambulance.js';


const router = express.Router();

// api로부터 구급차 데이터
router.get('/admin/saveAmbulance', ambulance.fetchDataAndSaveToDB);
// 가까운 순으로 구급차 리스트 정렬
router.post('/getRealtime', ambulance.getRealTimeData);
// 가장 가까운 구급차 전화번호
router.post('/getNearestAmbulance', ambulance.getNearestAmbulance);

export default router;