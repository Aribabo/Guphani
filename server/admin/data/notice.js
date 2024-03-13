import Mongoose from "mongoose";
import { noticeVirtualId } from "../db/database.js";
import moment from 'moment-timezone';

const noticeSchema = new Mongoose.Schema({
    title: { type: String, required: true },
    contents: { type: String, required: true }
    },
    { timestamps: true }
);

// 시간 설정
const newDate = new Date(Date.now())
const utcMoment = moment.utc(newDate);
const kstMoment = utcMoment.add(9, 'hours');
const dateInKST = kstMoment.toISOString();

noticeVirtualId(noticeSchema);

const notice = Mongoose.model('notice', noticeSchema);

// 사용자 공지사항
export async function userGetAll() {
    try {
        const data = await notice.find().sort({ createdAt: -1 })
        console.log('사용자 공지사항');
        return data;
    } catch (error) {
        console.error(error)
    }
}


// 공지사항작성
export async function createNotice(noticeData) {
    try {
        const { title, contents } = noticeData;

        const newNotice = new notice({ title, contents, createdAt:dateInKST });
        return newNotice.save().then((data) => { return data });
    } catch (error) {
        console.error(error)
    }
}

// 공지사항 조회
export async function getAll(query, page, limit) {
    const skip = (page - 1) * limit;
    try {
        // MongoDB에서 검색 후 정렬 및 페이징 적용
        const data = await notice.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await notice.countDocuments(query);
        const totalPage = Math.ceil(total / limit);
        return { data, totalPage, total };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// 공지사항 전체조회
export async function getAllNotices(query, page, limit) {
    try {
        const skip = (page - 1) * limit;
        return notice.find(query)
            .skip(skip)
            .limit(limit);

    } catch (error) {
        console.error(error)
    }
}


export async function countNotices(query) {
    try {
        const total = await notice.countDocuments(query);
        return total
    } catch (error) {
        console.error(error)
    }
}

// 공지사항 디테일
export async function getById(id) {
    try {
        return notice.findById(id);
    } catch (error) {
        console.error(error)
    }
}

// 공지사항 수정
export async function update(id, noticeData) {
    try {
        const { title, contents } = noticeData
        console.log(contents, '공지사항 수정');
        return notice.findByIdAndUpdate(
            id,
            { title, contents, updatedAt:dateInKST },
            {
                returnDocument: 'after'
            }
        )
    } catch (error) {
        console.error(error)
    }
}

// 공지사항 삭제
export async function remove(id) {
    try {
        return notice.findByIdAndDelete(id)
    } catch (error) {
        console.error(error)
    }
}

export async function removes(ids) {
    try {
        // 배열에 있는 모든 ID 값을 가진 데이터를 삭제합니다.
        return notice.deleteMany({ _id: { $in: ids } });

    } catch (error) {
        console.error(error)
    }
}