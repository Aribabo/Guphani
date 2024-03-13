import mongoose from "mongoose";

// 스키마 생성 
const userSchema = new mongoose.Schema({
    // 기본 입력값
    id: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: String,
    gender: String,
    birthdate: String,
    phoneNumber: String,
    isAdmin: String,
    isUser: String,
    joinDate: { type: Date, default: Date.now }, 
    
    // 추가 입력값 
    guardianPhoneNumber : { type: String, required: false }, 
    guardianRelationship : { type: String, required: false }, 
    bloodType : { type: String, required: false }, 
    underlyingDisease : { type: Array, required: false },
    allergy : { type: Array, required: false },
    medication: { type: Array, required: false },
});


const User = mongoose.model('User', userSchema);
// 비교 
userSchema.methods.comparePassword = function(candidatePassword, callback) {
    try {
        // bcrypt를 사용하여 비밀번호 비교
        bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
            if (err) {
                // 에러가 발생한 경우, 콜백에 에러 전달
                return callback(err);
            }
            // 에러가 없으면 결과를 콜백에 전달
            callback(null, isMatch);
        });
    } catch (error) {
        // try 블록에서 에러가 발생하면, 콜백에 에러 메시지 전달
        callback("에러가 발생했습니다: 비밀번호 비교");
    }
};


// 회원 조회
export async function getAll(query, page, limit) {
    try {
        const skip = (page - 1) * limit;
        // MongoDB에서 검색 후 정렬 및 페이징 적용
        const data = await User.find(query)
            .sort({ joinDate: -1 })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments(query);
        const totalPage = Math.ceil(total / limit);
        
        // 결과 반환
        return { data, totalPage, total };
    } catch (error) {
        // 에러가 발생한 경우, 에러 메시지를 한국어로 출력하고 에러 전달
        console.error('문의사항 조회 중 에러 발생:', error.message);
        throw new Error('서버에서 문의사항을 조회하는 중 에러가 발생했습니다.');
    }
}

// 회원 전체조회
export async function getAllUsers(query, page, limit) {
    try {
        const skip = (page - 1) * limit;

        // MongoDB에서 검색 후 페이징 적용
        const data = await User.find(query)
            .sort({ joinDate: -1 })
            .skip(skip)
            .limit(limit);

        // 결과 반환
        return data;
    } catch (error) {
        // 에러가 발생한 경우, 에러 메시지를 한국어로 출력하고 에러 전달
        console.error('문의사항 전체조회 중 에러 발생:', error.message);
        throw new Error('서버에서 문의사항을 전체 조회하는 중 에러가 발생했습니다.');
    }
}

// 회원 수 조회
export async function countUsers(query) {
    try {
        const total = await User.countDocuments(query);
        return total;
    } catch (error) {
        // 에러가 발생한 경우, console.error에 한국어로 에러 메시지 출력
        console.error('문의사항 수 조회 중 에러 발생:', error.message);
        throw new Error('서버에서 문의사항 수를 조회하는 중 에러가 발생했습니다.');
    }
}

// 여러 사용자 삭제
export async function removes(ids) {
    try {
        // 배열에 있는 모든 ID 값을 가진 데이터를 삭제합니다.
        const result = await User.updateMany({ _id: { $in: ids }, isUser: 'N' });
        return result;
    } catch (error) {
        // 에러가 발생한 경우, console.error에 한국어로 에러 메시지 출력
        console.error('사용자 삭제 중 에러 발생:', error.message);
        throw new Error('서버에서 사용자를 삭제하는 중 에러가 발생했습니다.');
    }
}

export { User };