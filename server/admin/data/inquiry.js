import Mongoose from "mongoose";
import MongoDb from 'mongodb';
import moment from 'moment-timezone';
const ObjectId = MongoDb.ObjectId;

const inquirySchema = new Mongoose.Schema({
    userId: {type:String, required: true },
    name: {type:String, required: true},
    title: {type:String, required: true },
    contents: {type:String, required: true },
    sort: {type:String, required: true},
    answerStatus: {type:String, require:true},
    answerContents: {type:String},
    answerDate: {type:String}
},
{ timestamps: true }
);

// 시간 설정
const newDate = new Date(Date.now())
const utcMoment = moment.utc(newDate);
const kstMoment = utcMoment.add(9, 'hours');
const dateInKST = kstMoment.toISOString();


const inquiry = Mongoose.model('inquiry', inquirySchema)

// 사용자 문의사항
export async function userGetByUserId(id) {
    try{
        const data = await inquiry.find({userId:id}).sort({createdAt : -1})
        return data;
    }catch(error){
        console.error(error);
    }
}

// 문의사항작성
export async function createInquiry(inquiryData) {
    try{
    const {userId ,title, contents, sort, name} = inquiryData;
    console.log(userId ,title, contents, sort, name);
    const newInquiry = new inquiry({userId, name, title, contents, sort, answerStatus:'N', answerContents: '', createdAt:dateInKST});
    return newInquiry.save().then((data) => { return data});
    }catch(error){
        console.error(error)
    }
}

// 문의사항 조회
export async function getAll(query, page, limit) {
    const skip = (page - 1) * limit;
    try {
        // MongoDB에서 검색 후 정렬 및 페이징 적용
        const data = await inquiry.find(query)
            .sort({createdAt : -1})
            .skip(skip)
            .limit(limit);

        const total = await inquiry.countDocuments(query);
        const totalPage = Math.ceil(total / limit);
        return { data, totalPage, total };
    } catch (error) {
        console.error(error); 
        throw error;
    }
}

// 문의사항 전체조회
export async function getAllInquirys(query, page, limit) {
    try{
    const skip = (page - 1) * limit;
    return inquiry.find(query)
        .skip(skip)
        .limit(limit);
    }catch(error){
        console.error(error)
    }
}

export async function countInquirys(query) {
    try{
        const total = await inquiry.countDocuments(query);
        return total
    }catch(error){
        console.error(error)
    }
}

// 문의사항 디테일
export async function getById(id) {
    try{
        return inquiry.findById(id);
    }catch(error){
        console.error(error)
    }
}

// 답변작성
export async function answer(inquiryData) {
    try{
        const {id, answerContents, answerDate} = inquiryData;
        return inquiry.findOneAndUpdate(new ObjectId(id),{
            answerContents,
            answerDate,
            answerStatus:'Y'},
            {
            returnDocument:'after'}
            )

    }catch(error){
        console.error(error)
    }
}
// 문의사항 수정
export async function update(id, inquiryData) {
    try{
        const {title, contents, sort} = inquiryData 
        console.log(contents, '문의사항 수정');
        return inquiry.findByIdAndUpdate(
            id,
            { title, contents, sort, createdAt:dateInKST },
            {
                returnDocument: 'after'
            }
        )
    }catch(error){
        console.error(error)
    }
}

// 문의사항 삭제
export async function remove(id) {
    try{
        return inquiry.findByIdAndDelete(id)

    }catch(error){
        console.error(error)
    }
}
export async function removes(ids) {
    try{
        // 배열에 있는 모든 ID 값을 가진 데이터를 삭제합니다.
        return inquiry.deleteMany({ _id: { $in: ids } });

    }catch(error){
        console.error(error)
    }
}