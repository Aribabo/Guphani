import Mongoose from "mongoose";
import { firstAidVirtualId } from "../db/database.js";
import moment from 'moment-timezone';

const firstAidSchema = new Mongoose.Schema({
    title: {type:String, required: true },
    youtube: {type:String},
    contents: {type:String, required: true }
},
{ timestamps: true }
);

// 시간 설정
const newDate = new Date(Date.now())
const utcMoment = moment.utc(newDate);
const kstMoment = utcMoment.add(9, 'hours');
const dateInKST = kstMoment.toISOString();

firstAidVirtualId(firstAidSchema);

const firstAid = Mongoose.model('firstAid', firstAidSchema)

// 사용자 응급처치
export async function userGetAll() {
    try {
      const data = await firstAid.find();
      return data;
    } catch (error) {
      console.error('사용자 데이터 조회 중 에러 발생:', error.message);
      throw new Error('사용자 데이터 조회 중 에러가 발생했습니다.');
    }
  }

// 응급처치작성
export async function createfirstAid(firstAidData) {
    try {
      const { title, contents, youtube } = firstAidData;
      const newfirstAid = new firstAid({ title, contents, youtube, createdAt:dateInKST });
      return await newfirstAid.save();
    } catch (error) {
      console.error('응급처치 정보 생성 중 에러 발생:', error.message);
      throw new Error('응급처치 정보 생성 중 에러가 발생했습니다.');
    }
  }

  export async function getAll(query, page, perPage) {
    try {
      const { title, contents, startDate, endDate } = query;
      const queryObj = {};
  
      // 제목으로 검색
      if (title) {
        queryObj.title = { $regex: new RegExp(title, 'i') };
      }
  
      // 내용으로 검색
      if (contents) {
        queryObj.contents = { $regex: new RegExp(contents, 'i') };
      }
  
      // 날짜로 검색
      if (startDate && endDate) {
        queryObj.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }
  
      // MongoDB에서 검색 후 정렬 및 페이징 적용
      const data = await firstAid.find(queryObj)
        .sort({ createdAt: -1 })
        .skip(perPage * (page - 1))
        .limit(perPage);
  
      // 검색 조건이 없으면 전체 게시글 수, 있으면 해당 조건에 맞는 게시글 수를 가져옴
      const total = await firstAid.countDocuments(queryObj);
      const totalPage = Math.ceil(total / perPage);
  
      return { data, totalPage, total };
    } catch (error) {
      console.error('응급처치 정보 조회 중 에러 발생:', error.message);
      throw new Error('응급처치 정보 조회 중 에러가 발생했습니다.');
    }
  }

// 응급처치 디테일
export async function getById(id) {
    try {
      return await firstAid.findById(id);
    } catch (error) {
      console.error('응급처치 디테일 조회 중 에러 발생:', error.message);
      throw new Error('응급처치 디테일 조회 중 에러가 발생했습니다.');
    }
  }

// 응급처치 수정
export async function update(id, firstAidDatas) {
    try {
      const { title, contents, youtube } = firstAidDatas;
      return await firstAid.findByIdAndUpdate(
        id,
        { title, contents, youtube, updatedAt:dateInKST },
        {
          returnDocument: 'after',
        }
      );
    } catch (error) {
      console.error('응급처치 수정 중 에러 발생:', error.message);
      throw new Error('응급처치 수정 중 에러가 발생했습니다.');
    }
  }

// 응급처치 삭제
export async function remove(id) {
    try {
      return await firstAid.findByIdAndDelete(id);
    } catch (error) {
      console.error('응급처치 삭제 중 에러 발생:', error.message);
      throw new Error('응급처치 삭제 중 에러가 발생했습니다.');
    }
  }

// 응급처치 선택삭제
export async function removes(ids) {
    try {
      // 배열에 있는 모든 ID 값을 가진 데이터를 삭제합니다.
      return await firstAid.deleteMany({ _id: { $in: ids } });
    } catch (error) {
      console.error('응급처치 선택삭제 중 에러 발생:', error.message);
      throw new Error('응급처치 선택삭제 중 에러가 발생했습니다.');
    }
  }