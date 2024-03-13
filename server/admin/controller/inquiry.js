import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as inquiryRepository from '../data/inquiry.js';
import { config } from '../config.js';

// 문의사항 작성
export async function create(req, res) {
    try {
        console.log('문의사항 들어옴');
        const { title, contents, sort } = req.body;
        const userId = req.id._id
        const name = req.id.name;
        const inquiry = await inquiryRepository.createInquiry({
            userId,
            title,
            contents,
            sort,
            name
        });
        console.log(inquiry);
        return res.status(201).json(inquiry);
    } catch (error) {
        console.error('문의사항 생성 중 에러 발생:', error);
        return res.status(500).json({ error: '문의사항을 생성하는 중 에러가 발생했습니다.' });
    }
}

// 문의사항 전체보기
export async function getInquirys(req, res) {
    try {
        const { name, contents, sort, answerStatus } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const query = {};

        if (name) {
            query.name = { $regex: new RegExp(name, 'i') };
        }

        if (contents) {
            query.contents = { $regex: new RegExp(contents, 'i') };
        }

        if (answerStatus) {
            query.answerStatus = { $regex: new RegExp(answerStatus, 'i') };
        }

        if (sort) {
            query.sort = { $regex: new RegExp(sort, 'i') };
        }

        const totalInquirys = await inquiryRepository.countInquirys(query);
        const totalPages = Math.ceil(totalInquirys / limit);
        const inquirys = await inquiryRepository.getAll(query, page, limit);

        res.status(200).json({ inquirys, totalPages });
    } catch (error) {
        console.error('문의사항 목록 조회 중 에러 발생:', error);
        res.status(500).json({ message: '문의사항 목록을 조회하는 중 에러가 발생했습니다.' });
    }
}

// 사용자 문의사항 전체보기
export async function userGetinquirys(req, res) {
    try {
        const id = req.id._id
        console.log(id);
        const data = await inquiryRepository.userGetByUserId(id);

        if (!data) {
            return res.status(500).json({ message: '문의사항이 없습니다.' });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error('사용자 문의사항 조회 중 에러 발생:', error);
        return res.status(500).json({ error: '사용자 문의사항을 조회하는 중 에러가 발생했습니다.' });
    }
}

// 문의사항 상세보기
export async function getInquiry(req, res, next) {
    try {
        const { id } = req.query;
        const inquiry = await inquiryRepository.getById(id);

        if (inquiry) {
            return res.status(200).json(inquiry);
        } else {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }
    } catch (error) {
        console.error('문의사항 상세 조회 중 에러 발생:', error);
        return res.status(500).json({ error: '문의사항 상세 정보를 조회하는 중 에러가 발생했습니다.' });
    }
}

// 관리자 답변 작성
export async function setAnswer(req, res, next) {
    try {
        const { id, answerContents, answerDate } = req.body;
        const answer = await inquiryRepository.answer({ id, answerContents, answerDate });
        console.log(answer);

        if (!answer) {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }

        return res.status(200).json(answer);
    } catch (error) {
        console.error('문의사항 답변 작성 중 에러 발생:', error);
        return res.status(500).json({ error: '문의사항 답변을 작성하는 중 에러가 발생했습니다.' });
    }
}

// 문의사항 수정
export async function updateInquiry(req, res, next) {
    try {
        const id = req.params.id;
        const { title, contents, sort } = req.body;
        console.log(title, contents, sort);
        const inquiry = inquiryRepository.getById(id);

        if (!inquiry) {
            return res.status(404).json({ message: '게시글이 없습니다.' });
        }

        const update = await inquiryRepository.update(id, { title, contents, sort });
        return res.status(200).json(update);
    } catch (error) {
        console.error('문의사항 수정 중 에러 발생:', error);
        return res.status(500).json({ error: '문의사항을 수정하는 중 에러가 발생했습니다.' });
    }
}

// 문의사항 삭제
export async function deleteInquiry(req, res) {
    try {
        console.log('문의사항 삭제');
        const id = req.params.id;
        const inquiry = await inquiryRepository.getById(id);

        if (!inquiry) {
            return res.status(400).json({ message: "게시물이 없습니다." });
        }

        const del = await inquiryRepository.remove(id);
        res.sendStatus(200);
    } catch (error) {
        console.error('문의사항 삭제 중 에러 발생:', error);
        return res.status(500).json({ error: '문의사항을 삭제하는 중 에러가 발생했습니다.' });
    }
}

// 문의사항 삭제
export async function deleteInquirys(req, res) {
    try {
        const datas = req.body;
        console.log(datas);
        const del = await inquiryRepository.removes(datas.ids);
        res.sendStatus(200);
    } catch (error) {
        console.error('다수의 문의사항 삭제 중 에러 발생:', error);
        return res.status(500).json({ error: '다수의 문의사항을 삭제하는 중 에러가 발생했습니다.' });
    }
}
