import express from "express";
import {body} from 'express-validator';
import {validate} from '../middleware/validator.js';
import * as noticeController from '../controller/notice.js';
import {isAuth} from '../middleware/auth.js';

const router = express.Router();

const validateWrite = [
    body('title').trim().notEmpty().withMessage('제목을 입력해주세요'),
    body('contents').trim().notEmpty().withMessage('내용을 입력해주세요'),
    validate
]

// 사용자 공지사항
router.get('/user/list', noticeController.userGetNotices)
router.get('/user/detail', noticeController.getNotice)

// 공지사항 이미지 첨부
router.post('/modify/imgUpload', noticeController.uploadImg)

router.use(isAuth)
// 공지사항 작성
router.post('/write',validateWrite, noticeController.create)
// 공지사항 전체 불러오기
router.get('/list', noticeController.getNotices)
// 공지사항 상세보기
router.get('/view', noticeController.getNotice)
// 공지사항 수정하기
router.get('/modify', noticeController.getNotice)
router.put('/modify/:id', noticeController.updateNotice)
// 공지사항 삭제하기
router.delete('/delete/:id', noticeController.deleteNotice)
// 공지사항 다중삭제
router.delete('/delete', noticeController.deleteNotices)


export default router;