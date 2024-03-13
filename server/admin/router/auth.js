import express from "express";
import {body} from 'express-validator'
import {validate} from '../middleware/validator.js'
import * as authController from '../controller/auth.js'
import {isAuth} from '../middleware/auth.js';

const router = express.Router();

const validateSignup = [
    body('id')
        .trim()
        .notEmpty()
        .withMessage('아이디는 반드시 입력해야 함')
        .isAlphanumeric() // 영문자/소문자로 구성됐는지 확인
        .withMessage('아이디는 영어 소문자와 숫자만 포함해야 함')
        .isLength({min:4, max:12})
        .withMessage('아이디는 4자에서 12자 사이여야 함'),
    body('password')
        .trim()
        .matches(/^(?=.*[a-zA-Z])(?=.*\d|.*[\W_])[a-zA-Z\d\W_]{6,20}$/) // 영문자, 숫자, 특수 문자 중 2가지 이상 조합
        .withMessage('비밀번호는 영문자(대소문자 상관없이), 숫자, 특수문자 중 2가지 이상을 조합하여 6~20자 이어야 함'),
    body('pwCheck')
        // password와 일치하는 지 확인
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('비밀번호가 일치하지 않습니다');
            }
            return true;
        })
        .notEmpty()
        .withMessage('비밀번호를 확인해 주세요'),
    body('name')
        .trim()
        .notEmpty()
        .withMessage('이름을 입력하세요')
        .matches(/^[a-zA-Z가-힣]+$/) // 영문 / 한글로 이루어져야 함
        .withMessage('이름은 한글 또는 영어로만 이루어져야 합니다'),
    body('birthdate')
        .trim()
        .notEmpty()
        .withMessage('생년월일을 입력하세요')
        .isNumeric() // 숫자로만 구성돼있는지 확인
        .withMessage('생년월일이 올바르지 않습니다.')
        .isLength({ min: 8, max: 8 }) // 반드시 8자
        .withMessage('생년월일이 올바르지 않습니다.'),
    body('phoneNumber')
        .trim()
        .notEmpty()
        .withMessage('휴대폰 번호를 입력하세요')
        .matches(/^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/) // 휴대폰 번호 형식인지 확인
        .withMessage('휴대폰 번호를 확인해주세요. (예: 010-1234-5678)'),
    validate
]


// 아이디 검색 
router.post('/searchId', authController.searchId)

// 비밀번호 변경용 검색 
router.post('/searchPw', authController.searchPw)

// 아이디 중복검사
router.get('/duplicateIdTest', authController.duplicateIdTest);

// 비밀번호 재설정 
router.put('/updatePassword', authController.updatePassword); 

// 관리자 회원가입 (postman에서만,관리자 권한 부여하기 위해서)
router.post('/admin/regist', authController.AdminSignUp);
// 관리자 로그인 
router.post('/admin/login', authController.adminSignIn);

// -------------------------------------------------------------------
// 사용자 회원가입
router.post('/user/signUp', authController.signUp);

// 사용자 추가 정보 입력 (기저 질환, 알러지, 평소 복용약, 보호자 번호, 보호자 관계)
router.put('/user/addInfo/:id', authController.addInfo);

// 사용자 로그인 (id, password)
router.post('/user/signIn', authController.signIn);

// 인증번호 전송
router.post('/user/sendVerification', authController.sendVerification) // const phoneNumber = req.body.phnumber;

// 인증번호 확인
router.post('/user/verifyCode', authController.verifyCode) // body: phnumber, verificationCode



// Apply isAuth middleware to routes below
router.use(isAuth);

// 회원 정보 수정 
router.put('/user/updateAll/:id', authController.updateUser);

// 회원 정보 삭제
router.delete('/user/delete/:id', authController.deleteUser);

// 회원 정보 상세 조회 
router.get('/user/admin/detail/:id',  authController.searchUser);

// 회원 인포 조회
router.get('/user/info/:id', isAuth, authController.findByUserId);

// 회원 정보 전체 조회 
router.get('/users', authController.searchAll);

// 사용자 다중삭제
router.put('/user/delete',isAuth, authController.deleteUsers);
// -------------------------------------------------------------------

// 사용자 회원 탈퇴 
router.delete('/user/withdraw/:id', authController.withdraw);

// 사용자 회원 정보 수정 (password, name, birthdate, phonenumber, address)
router.put('/user/updateMain',  authController.updateMain);

// 사용자 추가 정보 수정 (기저 질환, 알러지, 평소 복용약, 보호자 번호, 보호자 관계)
router.put('/user/updateOther', authController.updateOther);

// 사용자 회원 정보 상세 조회 
router.get('/user/detail/:id',  authController.searchMoUser);

export default router;