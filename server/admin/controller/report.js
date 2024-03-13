import { User } from '../data/auth.js';
import { generateEmergencyMessage } from '../data/report.js';

export async function createSMS(req, res, next) {
    console.log('report 접속');
    try {
        const { id } = await User.findOne({ id: req.params.id });
        const emergencyMessage = await generateEmergencyMessage(id);
        res.status(200).json({ emergencyMessage });
        console.log(emergencyMessage);
    } catch (error) {
        console.error('에러가 발생했습니다:', error);
        res.status(402).json({ result: '실패', message: '에러가 발생했습니다.' });
    }
}
