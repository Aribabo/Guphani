import express from "express";
import {isAuth} from '../middleware/auth.js';
import {createSMS} from '../controller/report.js'

const router = express.Router();


router.post('/user/report/:id',  createSMS);

export default router;