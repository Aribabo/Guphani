import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import passport from 'passport';
import mongoose from 'mongoose';
import LocalStrategy from 'passport-local';
import { User } from '../data/auth.js'; 
import * as userRepository from '../data/auth.js';
import { config } from '../config.js';
import coolsms from 'coolsms-node-sdk';
import moment from 'moment-timezone';

// 인증번호
const apiKey = config.sms.sms_api;
const apiSecret = config.sms.sms_secret;

const sms = coolsms.default;
const messageService = new sms(apiKey, apiSecret);

export let verificationStorage = {}; // verificationStorage를 export합니다.

function generateVerificationCode(length) {
  const numbers = '0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  return code;
}

// 생성된 인증번호 6자리를 verificationCode에 변환 후 verificationStorage[phoneNumber]에 저장
export async function sendVerificationMessage(phoneNumber) {
    const verificationCode = generateVerificationCode(6);
    console.log(verificationCode)
    try {
        const params = {
            to: phoneNumber,
            from: config.sms.sendNumber,
            text: `인증 번호는 ${verificationCode}입니다.`
        };
        const response = await messageService.sendOne(params);
        verificationStorage[phoneNumber] = verificationCode;
        return { verificationCode, response };
    } catch (error) {
        console.error(error);
        throw new Error('인증번호 전송 실패');
    }
}

// 입력한 전화번호로 인증번호를 전송
export async function sendVerification(req, res) {

    const phoneNumber = req.body.phnumber;
    console.log(phoneNumber)
    try {
        const verificationCode = await sendVerificationMessage(phoneNumber);
        console.log(verificationCode)
        res.status(200).json({ message: '인증번호가 전송되었습니다.' });
    } catch (error) {
        res.status(500).json({ message: '인증번호 전송 실패', error: error.message });
    }
}

// 인증코드 반환
export function getVerificationCode(phoneNumber) {
    return verificationStorage[phoneNumber];
}

// 저장된 인증번호(storedCode)와 입력한 인증번호(verificationCode)를 비교
export async function verifyCode(req, res) {
    const { phnumber, verificationCode } = req.body;
    try {
        const storedCode = verificationStorage[phnumber];
        if (verificationCode === storedCode) {
            res.status(200).json({ message: '인증 성공' });
        } else {
            res.status(400).json({ message: '잘못된 인증번호' });
        }
    } catch (error) {
        res.status(500).json({ message: '인증 검증 실패', error: error.message });
    }
}

// Passport Local Strategy
passport.use(new LocalStrategy(
    { usernameField: 'id' },
    async (id, password, done) => {
        try {
            const user = await User.findOne({ id });

            if (!user) {
                return done(null, false, { message: '아이디가 일치하지 않습니다.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
            }
        } catch (error) {
            return done(error);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return done(null, false);
        }

        const user = await User.findById(id);

        if (!user) {
            return done(null, false);
        }

        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// 아이디 중복검사
export async function findById(req, res) {
    const id = req.body;
    console.log(id);
    try {
        const found = await User.findOne({ id: id });

        if (found) {
            return res.status(409).json({ isUser: 'Y' });
        }
        return res.status(200).json({ isUser: 'N' });
    } catch (error) {
        console.error('아이디 중복검사 중 에러 발생:', error);
        res.status(500).json({ isUser: 'N', error: '아이디 중복검사 중 에러 발생' });
    }
}

// 핸드폰번호 중복검사
export async function findByHp(req, res) {
    const hp = req.body;
    console.log(hp);
    try {
        const found = await User.findOne({ phoneNumber: hp });

        if (found) {
            return res.status(409).json({ isUser: 'Y' });
        }
        return res.status(200).json({ isUser: 'N' });
    } catch (error) {
        console.error('핸드폰번호 중복검사 중 에러 발생:', error);
        res.status(500).json({ isUser: 'N', error: '핸드폰번호 중복검사 중 에러 발생' });
    }
}

// 회원가입
export async function AdminSignUp(req, res) {
    const { id, password, name, gender, birthdate, phoneNumber, isAdmin, isUser } = req.body;
    try {
        const found = await User.findOne({ id: id });
        if (found) {
            return res.status(409).json({ message: '이미 가입된 아이디입니다.' });
        }

        const hashed = await bcrypt.hash(password, 10);
        const newUser = new User({
            id,
            password: hashed,
            name,
            gender,
            birthdate,
            phoneNumber,
            isAdmin,
            isUser
        });
        await newUser.save();

        res.status(201).json({ id });
    } catch (error) {
        console.error('회원가입 중 에러 발생:', error);
        res.status(500).json({ message: '회원가입 중 에러 발생' });
    }
}

// 로그인 (관리자)
export async function adminSignIn(req, res) {
    const { id, password } = req.body;
    try {
        // Retrieve the hashed password from the database
        const user = await User.findOne({ id: id, isAdmin: 'Y' });

        if (!user) {
            return res.status(401).json({ message: '아이디가 일치하지 않습니다. 다시 로그인해주세요.' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({ message: '비밀번호가 일치하지 않습니다. 다시 로그인해주세요.' });
        }

        const token = createJwtToken(user);
        res.status(200).json({ user, token });
    } catch (error) {
        console.error('로그인 중 에러 발생:', error);
        res.status(500).json({ message: '로그인 중 에러 발생' });
    }
}

// 회원 정보 전체 수정 
export async function updateUser(req, res, next) {
    try {
        const { name, gender, birthdate, phoneNumber, isAdmin, isUser, 
            guardianPhoneNumber, guardianRelationship, bloodType, underlyingDisease, 
            allergy, medication } = req.body;
        
        const updatedUser = await User.findOneAndUpdate(
            { _id: req.params.id }, // 아이디로 condition 필터
            { $set: { name, gender, birthdate, phoneNumber, isAdmin, isUser, guardianPhoneNumber, 
            guardianRelationship, bloodType, underlyingDisease, allergy, medication } }, // 회원 정보 중에서 수정할 부분 
            { new: true } // 값 출력 
        );

        if (!updatedUser) {
            res.json({ result: '실패', message: '회원이 없습니다' });
            return;
        }

        res.json({ result: '성공', message: '회원님의 정보가 업데이트 되었습니다. 확인해주세요.', user: updatedUser });
        } catch (error) {
        console.error('업데이트 할 때 에러가 발생했습니다:', error);
        res.json({ result: '실패', message: '회원정보 업데이트할 때 에러발생했습니다.' });
        }
}

// 회원정보 삭제
export async function deleteUser(req, res, next) {
    try {
        // Update isUser field to 'N' instead of deleting the user
        const updatedUser = await User.findOneAndUpdate(
            { _id:req.params.id },
            { $set: { isUser: 'N' } },
            { new: true }
        );

        if (!updatedUser) {
            res.json({ result: '실패', message: '해당 회원을 찾을 수 없습니다' });
            return;
        }

        res.json({
            result: '성공',
            message: '회원님이 성공적으로 탈퇴하셨습니다. 다음 기회에 급하니를 찾아주세요.',
            user: updatedUser,
        });
    } catch (error) {
        console.error('회원 정보 탈퇴 중 에러 발생:', error);
        res.json({ result: '실패', message: '회원 정보 탈퇴 중 에러 발생' });
    }
    }

// 회원 정보 상세 조회
export async function searchUser(req, res, next) {
    const id = req.params.id
    try {
        const userInfo = await User.findById(id);
        
        if (!userInfo) {
            res.json({ result: '실패', message: '해당 회원을 찾을 수 없습니다' });
            return;
        }
        res.json({ result: '성공', message: '해당 회원 정보 조회 성공', user: userInfo });
    } catch (error) {
        console.error('회원 정보 조회 중 에러 발생:', error);
        res.json({ result: '실패', message: '회원 정보 조회 중 에러 발생' });
    }

}
// 사용자 정보 상세 조회
export async function searchMoUser(req, res, next) {
    try {
        const userInfo = await User.findOne({id:req.params.id});
        
        if (!userInfo) {
            res.json({ result: '실패', message: '해당 회원을 찾을 수 없습니다' });
            return;
        }
        res.json({ result: '성공', message: '해당 회원 정보 조회 성공', user: userInfo });
    } catch (error) {
        console.error('회원 정보 조회 중 에러 발생:', error);
        res.json({ result: '실패', message: '회원 정보 조회 중 에러 발생' });
    }

}

// 회원 전체보기
export async function searchAll(req, res) {
    const { name, id, gender } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    // const title = req.query.title || '';

    const query = {};

    // 작성자 이름으로 검색
    if (name) {
        query.name = { $regex: new RegExp(name, 'i') };
    }

    // 아이디 검색
    if (id) {
        query.id = { $regex: new RegExp(id, 'i') };
    }

    // 성별 검색
    if (gender) {
        query.gender = { $regex: new RegExp(gender, 'i') };
    }

    try {
        const totalUsers = await userRepository.countUsers(query);
        const totalPages = Math.ceil(totalUsers / limit);
        const users = await userRepository.getAll(query, page, limit);

        res.status(200).json({ users, totalPages });
    } catch (error) {
        console.error(error); // 오류를 로깅
        res.status(500).json({ message: '서버 오류 발생' });
    }
}
    

// 회원 선택 삭제
export async function deleteUsers(req, res) {
    const datas = req.body;
    const del = await userRepository.removes(datas.ids);
    res.sendStatus(200);
}

// 회원인포출력 *유저 아이디로 찾는거
export async function findByUserId(req, res) {
    const id = req.params.id;
    const user = await User.findOne({id});

    return res.status(200).json(user);
}

// ----------------------------------------------------------------------


// 회원가입 (사용자/관리자)
export async function signUp(req, res) {
    const { id, password, name, birthdate, gender, phoneNumber } = req.body;

    // 시간 설정
    const newDate = new Date(Date.now())
    const utcMoment = moment.utc(newDate);
    const kstMoment = utcMoment.add(9, 'hours');
    const dateInKST = kstMoment.toISOString();

    const found = await User.findOne({ id: id });
    if (found) {
        return res.status(409).json({ message: `${id}이 이미 존재합니다. 다른 아이디로 회원가입해주세요`});
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({
        id, 
        password: hashed, 
        name, 
        birthdate, 
        gender, 
        phoneNumber, 
        isAdmin: "N", // Set default value as "N"
        isUser: "Y",   // Set default value as "Y"
        joinDate: dateInKST
    });
    await newUser.save(); 
    console.log(newUser);
    res.status(201).json( { id });
}

// 로그인 (사용자)
export async function signIn(req, res) {
    const { id, password } = req.body;
    // Retrieve the hashed password from the database
    const user = await User.findOne({ id: id, isUser: 'Y' });
    if (!user) {
        return res.status(401).json({ message: '등록된 회원이 없습니다.' });
    }
    
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        return res.status(402).json({ message: '아이디 비밀번호가 일치하지 않습니다.' });
    }

    const token = createJwtToken(user);
    res.status(200).json({user, token});
}


function createJwtToken(id) {
    return jwt.sign({ id }, config.jwt.secretKey, { expiresIn: config.jwt.expiresInSec });
}


// validateCredential/ValidateSignup 만들어 주기 

// 추가 정보 입력 (사용자)
export async function addInfo(req, res, next) {
    const userId = req.params.id; 
    const newData = req.body; 

    try {

        const updatedUser = await User.findOneAndUpdate(
            { id: userId }, // 아이디로 condition 필터
            { $set: { 
                guardianPhoneNumber: newData.guardianPhoneNumber,
                guardianRelationship: newData.guardianRelationship,
                underlyingDisease: newData.underlyingDisease,
                allergy: newData.allergy,
                medication: newData.medication,
                bloodType: newData.bloodType
            } 
        },
            { new: true } // 값 출력 
        );

        if (!updatedUser) {
            res.json({ result: '실패', message: '회원이 없습니다' });
            return;
        }

        res.json({ result: '성공', message: '회원님의 추가 정보가 입력되었습니다. 확인해주세요.', user: updatedUser });
    } catch (error) {
        console.error('회원님의 추가 정보 입력할 때 에러가 발생했습니다:', error);
        res.json({ result: '실패', message: '회원님의 추가 정보를 업데이트할 때 에러발생했습니다.' });
    }
}


// 회원 탈퇴 (사용자)
export async function withdraw(req, res, next) {
    try {
        // Extract user ID from the token
        const userIdFromToken = req.id.id;

        // Compare user ID from token with the ID in the request parameters
        if (userIdFromToken !== req.params.id) {
            res.status(403).json({ result: '실패', message: '본인 계정만 탈퇴 가능합니다.' });
            return;
        }

        // Update isUser field to 'N' instead of deleting the user
        const updatedUser = await User.findOneAndUpdate(
            { id: req.params.id },
            { $set: { isUser: 'N' } },
            { new: true }
        );

        if (!updatedUser) {
            res.json({ result: '실패', message: '해당 회원을 찾을 수 없습니다' });
            return;
        }

        res.json({
            result: '성공',
            message: '성공적으로 탈퇴되었습니다. 급하니는 회원가입 없이도 사용가능합니다.',
            user: updatedUser,
        });
    } catch (error) {
        console.error('회원 탈퇴 중 에러 발생:', error);
        res.json({ result: '실패', message: '회원 탈퇴 중 에러 발생' });
    }
}


// 회원 정보 수정 (사용자)
export async function updateMain(req, res, next) {
    try {
        const { id, name, birthdate, gender, phoneNumber } = req.body;

        // Extract user ID from the token
        // const userIdFromToken = req.id;

        // Compare user ID from token with the ID in the request parameters
        // if (userIdFromToken !== req.params.id) {
        //     res.status(403).json({ result: '실패', message: '본인 정보만 수정 가능합니다.' });
        //     return;
        // }

        const updatedUser = await User.findOneAndUpdate(
            { id : id },
            { $set: { name, birthdate, gender, phoneNumber }},
            { new: true }
        );

        if (!updatedUser) {
            res.json({ result: '실패', message: '회원이 없습니다' });
            return;
        }
        res.json({ result: '성공', message: '회원님의 메인 정보가 업데이트 되었습니다. 확인해주세요.', user: updatedUser });
    } catch (error) {
        console.error('회원님의 메인 정보 업데이트 할 때 에러가 발생했습니다:', error);
        res.json({ result: '실패', message: '회원님의 메인 정보 업데이트할 때 에러발생했습니다.' });
    }
}

// 추가 정보 수정 (사용자)
export async function updateOther(req, res, next) {
    try {
        const { id, guardianPhoneNumber, guardianRelationship, bloodType, underlyingDisease, allergy, medication } = req.body;

        // Extract user ID from the token
        const userIdFromToken = req.id.id;
        // Compare user ID from token with the ID in the request parameters
        if (userIdFromToken !== id) {
            res.status(403).json({ result: '실패', message: ' 본인 정보만 수정 가능합니다.' });
            return;
        }

        const updatedOtherUser = await User.findOneAndUpdate(
            { id: id },
            { $set: { guardianPhoneNumber, guardianRelationship, bloodType, underlyingDisease, allergy, medication }},
            { new: true }
        );

        if (!updatedOtherUser) {
            res.json({ result: '실패', message: '회원이 없습니다' });
            return;
        }

        res.json({ result: '성공', message: '회원님의 추가 정보가 업데이트 되었습니다. 확인해주세요.', user: updatedOtherUser });
    } catch (error) {
        console.error('에러가 발생했습니다. 다시 시도해주세요.', error);
        res.json({ result: '실패', message: '에러가 발생했습니다. 다시 시도해주세요.' });
    }
}


// 아이디 찾기 
export async function searchId(req, res, next) {
    try {
        const { name, phoneNumber } = req.body;
        const foundUser = await User.find({ name,phoneNumber }); // Use findOne instead of find
        if (foundUser) {
            res.json({ foundUser}); 
        } else {
            res.status(404).json({ message: '회원을 찾을 수 없음' });
        }
    } catch (error) {
        console.error('Error in searchId:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// 비번찾기
export async function searchPw(req, res, next) {
    try {
        const { id, phoneNumber } = req.body;
        const foundUser = await User.findOne({ id }); // Use findOne instead of find
        if (parseInt(foundUser.phoneNumber.replace(/[^0-9]/g, '')) === parseInt(phoneNumber)) {
            res.json({ user:foundUser, message: '회원을 찾음'}); 
        } else {
            res.status(404).json({ message: '회원을 찾을 수 없음' });
        }
    } catch (error) {
        console.error('Error in searchPw:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// 아이디 찾기 위해서 mongodb에 있는 userid 들 불러오기 
export async function duplicateIdTest(req, res, next) {

    try {
        // Fetch all user IDs from the User collection in MongoDB, selecting only the 'id' field
        const allUserIds = await User.find({}, 'id');

        // Send the array of user IDs as a JSON response to the client
        res.json(allUserIds);
    } catch (error) {
        // Handle errors during the fetching process
        console.error('Error fetching user IDs:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// 비밀번호 재설정 
export async function updatePassword(req, res, next) {
    try {
        const { id, phoneNumber, newPassword } = req.body; // Extract newPassword from req.body
        const user = await User.findOne({ id, phoneNumber }); // Use findOne instead of find

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const hashed = await bcrypt.hash(newPassword, 10);


        const updatedPassword = await User.findOneAndUpdate(
            { id },
            { $set: { password: hashed } }
        );

        if (!updatedPassword) {
            res.json({ result: '실패', message: '비밀번호 재설정 실패' });
            return;
        }

        // Return success response
        return res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
        // Handle errors appropriately, for now, just log the error
        console.error('Error updating password:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}