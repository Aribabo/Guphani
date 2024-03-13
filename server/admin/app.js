import express from 'express';
import morgan from 'morgan';
import cors from 'cors'
import bodyParser from 'body-parser';
import session from 'express-session';
import crypto from 'crypto';
import authRouter from './router/auth.js'
import noticeRouter from './router/notice.js'
import firstAidRouter from './router/firstAid.js'
import emergencyRouter from './router/emergency.js'
import pharmacyRouter from './router/pharmacy.js'
import ambulanceRouter from './router/ambulance.js'
import reportRouter from './router/report.js'
import inquiryRouter from './router/inquiry.js'
import {config} from './config.js'
import { connectDB } from './db/database.js';
import {initSocket} from './connection/socket.js'


const app = express();

// Middleware
app.use(bodyParser.json());
const secretKey = crypto.randomBytes(32).toString('hex');
app.use(
    session({
        secret: secretKey,
        resave: false,
        saveUninitialized: true
    })
);

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
// 허용되는 출처 설정
const allowedOrigins = ['https://www.guphani.com'];

// cors 미들웨어 사용
// app.use(cors({
//   origin: function (origin, callback) {
//     // 허용되는 출처인지 확인
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('CORS 오류: 허용되지 않는 출처'));
//     }
//   },
//   // 다른 CORS 관련 옵션도 필요할 경우 추가
// }));

// user
app.use('/auth', authRouter);

// 공지사항
app.use('/admin/notice/', noticeRouter)
app.use('/notice', noticeRouter)

// 응급처치
app.use('/admin/firstAid/', firstAidRouter)
app.use('/firstAid/', firstAidRouter)

// 응급실 & 특수응급
app.use('/emergency' ,emergencyRouter)
// 119
app.use('/emergency', reportRouter)
// 사설구급차
app.use('/ambulance', ambulanceRouter)
// 약국
app.use('/pharmacy', pharmacyRouter);
// 문의하기
app.use('/admin/inquiry', inquiryRouter);
app.use('/inquiry', inquiryRouter);

// 이미지 업로드
app.use('/uploads', express.static('uploads'));

app.use((req, res, next) => {
    res.sendStatus(404);
});

connectDB().then(() =>{
    const server=app.listen(config.host.port);
    console.log('db연결');
    initSocket(server) 
}).catch(console.error);