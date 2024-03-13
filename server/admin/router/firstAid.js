import express from "express";
import {body} from 'express-validator';
import {validate} from '../middleware/validator.js';
import * as firstAidController from '../controller/firstAid.js';
import {isAuth} from '../middleware/auth.js';

const router = express.Router();

const validateWrite = [
    body('title').trim().notEmpty().withMessage('제목을 입력해주세요'),
    body('contents').trim().notEmpty().withMessage('내용을 입력해주세요'),
    validate
]


// 사용자 응급처치
router.get('/user/list', firstAidController.userGetfirstAids)
router.get('/user/detail', firstAidController.getfirstAid)

// 응급처치 작성
router.post('/write',validateWrite,isAuth, firstAidController.create)
// 응급처치 전체 불러오기
router.get('/list',isAuth, firstAidController.getfirstAids)
// 응급처치 상세보기
router.get('/view',isAuth, firstAidController.getfirstAid)
// 응급처치 수정하기
router.get('/modify',isAuth, firstAidController.getfirstAid)
router.put('/modify/:id',isAuth, validateWrite, firstAidController.updatefirstAid)
// 응급처치 삭제하기
router.delete('/delete/:id',isAuth, firstAidController.deletefirstAid)
// 응급처치 다중삭제
router.delete('/delete',isAuth, firstAidController.deletefirstAids)
// 응급처치 이미지 첨부
// router.post('/firstAid/imgUpload', firstAidController.uploadImg)

export default router;