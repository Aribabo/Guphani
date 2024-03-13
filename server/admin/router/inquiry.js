import express from "express";
import {body} from 'express-validator';
import {validate} from '../middleware/validator.js';
import * as inquiryController from '../controller/inquiry.js';
import {isAuth} from '../middleware/auth.js';

const router = express.Router();

const validateWrite = [
    body('sort').trim().notEmpty().withMessage('분류을 선택해주세요'),
    body('title').trim().notEmpty().withMessage('제목을 입력해주세요'),
    body('contents').trim().notEmpty().withMessage('내용을 입력해주세요'),
    validate
]

// 사용자 문의하기
router.get('/user/list',isAuth, inquiryController.userGetinquirys)
// 사용자 문의하기 작성
router.post('/user/write',validateWrite, isAuth, inquiryController.create)
// 문의하기 전체 불러오기
router.get('/list', isAuth, inquiryController.getInquirys)
// 문의하기 상세보기
router.get('/view',isAuth, inquiryController.getInquiry) //관리자
router.get('/user/view',isAuth, inquiryController.getInquiry) //사용자
// 문의하기 수정하기
router.get('/modify',isAuth, inquiryController.getInquiry)
router.put('/modify/:id',isAuth, inquiryController.updateInquiry)
// 문의하기 삭제하기
router.delete('/delete/:id',isAuth, inquiryController.deleteInquiry)
// 문의하기 다중삭제
router.delete('/delete',isAuth, inquiryController.deleteInquirys)
// 답변작성
router.put('/answer', isAuth, inquiryController.setAnswer)


export default router;