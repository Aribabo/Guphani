import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as noticeRepository from '../data/notice.js';
import { config } from '../config.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../../client/img/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Buffer.from(file.originalname, 'binary').toString('utf-8'));
    },
});

const upload = multer({ storage: storage });

export async function uploadImg(req, res, next) {
    try {
        upload.single('file')(req, res, (err) => {
            console.log(req.file);
            if (err) {
                console.error('파일 업로드 중 에러 발생', err);
                return res.status(500).json({ error: '파일 업로드 중 에러 발생' });
            }

            req.file.originalname = Buffer.from(req.file.originalname, 'binary').toString('utf-8');
            res.json({
                url: path.join(req.file.originalname),
            });
        });
    } catch (error) {
        console.error('이미지 업로드 중 에러 발생', error);
        res.status(500).json({ error: '이미지 업로드 중 에러 발생' });
    }
}

// 공지사항 작성
export async function create(req, res) {
    try {
        const { title, contents } = req.body;
        const notice = await noticeRepository.createNotice({
            title,
            contents
        });
        console.log(notice);
        return res.status(201).json(notice);
    } catch (error) {
        console.error('공지사항 생성 중 에러 발생:', error);
        return res.status(500).json({ error: '공지사항을 생성하는 중 에러가 발생했습니다.' });
    }
}

// 공지사항 전체보기
export async function getNotices(req, res) {
    try {
        const { contents, startDate, endDate } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const title = req.query.title || '';
        const query = {};

        if (title) {
            query.title = { $regex: new RegExp(title, 'i') };
        }

        if (contents) {
            query.contents = { $regex: new RegExp(contents, 'i') };
        }

        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        const totalNotices = await noticeRepository.countNotices(query);
        const totalPages = Math.ceil(totalNotices / limit);
        const notices = await noticeRepository.getAll(query, page, limit);

        res.status(200).json({ notices, totalPages });
    } catch (error) {
        console.error('공지사항 목록 조회 중 에러 발생:', error);
        res.status(500).json({ message: '공지사항 목록을 조회하는 중 에러가 발생했습니다.' });
    }
}

// 사용자 공지사항 전체보기
export async function userGetNotices(req, res) {
    try {
        const data = await noticeRepository.userGetAll();
        console.log('사용자 공지사항 들어옴');
        if (!data) {
            return res.status(500).json({ message: '공지사항이 없습니다.' });
        }
        return res.status(200).json(data);
    } catch (error) {
        console.error('사용자 공지사항 조회 중 에러 발생:', error);
        return res.status(500).json({ error: '사용자 공지사항을 조회하는 중 에러가 발생했습니다.' });
    }
}

// 공지사항 상세보기
export async function getNotice(req, res, next) {
    try {
        const { id } = req.query;
        const notice = await noticeRepository.getById(id);

        if (notice) {
            return res.status(200).json(notice);
        } else {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }
    } catch (error) {
        console.error('공지사항 상세 조회 중 에러 발생:', error);
        return res.status(500).json({ error: '공지사항 상세 정보를 조회하는 중 에러가 발생했습니다.' });
    }
}

// 공지사항 수정
export async function updateNotice(req, res, next) {
    try {
        const id = req.params.id;
        const { title, contents } = req.body;
        const notice = noticeRepository.getById(id);

        if (!notice) {
            return res.status(404).json({ message: '게시글이 없습니다.' });
        }

        const update = await noticeRepository.update(id, { title, contents });
        return res.status(200).json(update);
    } catch (error) {
        console.error('공지사항 수정 중 에러 발생:', error);
        return res.status(500).json({ error: '공지사항을 수정하는 중 에러가 발생했습니다.' });
    }
}

// 공지사항 삭제
export async function deleteNotice(req, res) {
    try {
        const id = req.params.id;
        const notice = await noticeRepository.getById(id);

        if (!notice) {
            return res.status(400).json({ message: "게시물이 없습니다." });
        }

        const del = await noticeRepository.remove(id);
        res.sendStatus(200);
    } catch (error) {
        console.error('공지사항 삭제 중 에러 발생:', error);
        return res.status(500).json({ error: '공지사항을 삭제하는 중 에러가 발생했습니다.' });
    }
}

// 공지사항 삭제
export async function deleteNotices(req, res) {
    try {
        const datas = req.body;
        console.log(datas);
        const del = await noticeRepository.removes(datas.ids);
        res.sendStatus(200);
    } catch (error) {
        console.error('다수의 공지사항 삭제 중 에러 발생:', error);
        return res.status(500).json({ error: '다수의 공지사항을 삭제하는 중 에러가 발생했습니다.' });
    }
}
