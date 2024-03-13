import * as pharmacyRepository from '../data/pharmacy.js';

// 약국데이터를 불러와서 MongoDB에 저장
export async function setAllPharmacy(req, res) {
    try {
        const result = await pharmacyRepository.setPharmacyDataByCityArray();
        res.json(result);
    } catch (error) {
        console.error('약국 데이터 저장 중 에러 발생:', error);
        res.status(500).json({ error: '약국 데이터를 저장하는 중 에러가 발생했습니다.' });
    }
}

export async function getNearPharmacy(req, res) {
    try {
        const { latitude, longitude } = req.body;
        const result = await pharmacyRepository.getNearPharmacy(latitude, longitude);
        res.json(result);
    } catch (error) {
        console.error('주변 약국 조회 중 에러 발생:', error);
        res.status(500).json({ error: '주변 약국을 조회하는 중 에러가 발생했습니다.' });
    }
}
// export async function getAllPharmacy(req, res ) {
//     const { latitude,longitude } = req.body;
//     const result = await pharmacyRepository.getAllPharmacy(latitude,longitude)
//     res.json(result)
// }

// // 공휴일약국 불러오기
// export async function getHolidayPharmacy(req, res ) {
//     const result = await pharmacyRepository.getHoliday()
//     res.json(result)
// }