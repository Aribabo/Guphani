import { parseString } from 'xml2js';
import { Ambulance } from '../data/ambulance.js'; 
import dotenv from 'dotenv';
import haversine from 'haversine-distance';
dotenv.config();


// 구급차 api에서 데이터들을 가져와 몽고db Ambulances 스키마에 저장
export async function fetchDataAndSaveToDB(req, res) {
    try {
        let pageNo = 1;

        while (true) {
            const response = await fetch(`https://apis.data.go.kr/B552657/AmblInfoInqireService/getAmblListInfoInqire?serviceKey=4VqI9ZKwHNgkrVIUOE6VYc9TVkWzrVvSwD6tMDQczav7OPJsFAcG6y9wrE1fcsG6cMsYWj7FQgryDYB%2BhVb23w%3D%3D&carseq=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C&pageNo=${pageNo}&numOfRows=1000`, { method: 'GET' });
            const xmldata = await response.text();
            let datas;
            parseString(xmldata, async (err, result) => {
                if (err) {
                    console.error('XML 파싱 에러:', err);
                    return res.status(500).json({ error: 'XML 파싱 중 에러가 발생했습니다.' });
                }
                const items = result.response.body[0].items[0].item;
                datas = items;

                for (var i = 0; i < datas.length; i++) {
                    const data = datas[i];
                    // 데이터 처리 및 저장 로직 유지
                    const ambulanceDetail = {
                        rnum: data.rnum[0],
                        amblrescd: data.amblrescd && data.amblrescd[0]?.trim() || null,
                        ambltypcd: data.ambltypcd && data.ambltypcd[0]?.trim() || null,
                        carMafYea: data.carMafYea && data.carMafYea[0]?.trim() || null,
                        carSeq: data.carSeq && data.carSeq[0]?.trim() || null,
                        carKndNam: data.carkndnam && data.carkndnam[0]?.trim() || null,
                        dutyAddr: data.dutyAddr && data.dutyAddr[0]?.trim() || null,
                        dutyName: data.dutyName && data.dutyName[0]?.trim() || null,
                        onrAdr: data.onrAdr && data.onrAdr[0]?.trim() || null,
                        onrNam: data.onrNam && data.onrNam[0]?.trim() || null,
                        onrTel: data.onrTel && data.onrTel[0]?.trim() || null,
                        onrZipCod: data.onrZipCod && data.onrZipCod[0]?.trim() || null,
                        oprEmogcode: data.oprEmogcode && data.oprEmogcode[0]?.trim() || null,
                        regday: data.regday && data.regday[0]?.trim() || null
                    };

                    const result = await Ambulance.findOneAndUpdate(
                        { rnum: ambulanceDetail.rnum }, // 필터
                        ambulanceDetail, // 넣을 값
                        { new: true, upsert: true } // 옵션
                    );
                }
            });

            if (datas.length < 1000) {
                break;
            } else {
                // pageNo 증가
                console.log(pageNo);
                pageNo++;
            }
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('데이터 가져오기 및 저장 중 에러:', error);
        return res.status(500).json({ error: '데이터 가져오기 및 저장 중 에러가 발생했습니다.' });
    }
}

// 현재 위치에서 가장 가까운 순으로 구급차 리스트 정렬 ( 현재 위치는 client에서 받음 )
export async function getRealTimeData(req, res) {
    try {
        const { userLatitude, userLongitude } = req.body;
        console.log(userLatitude, userLongitude);
        const ambulanceData = await Ambulance.find({ x: { $exists: true }, y: { $exists: true } }).lean();
        const ambulanceDataWithDistance = ambulanceData.map((ambulance) => {
            // Haversine 공식을 사용하여 두 지점 사이의 거리 계산
            const distance = haversine(
                { latitude: userLatitude, longitude: userLongitude },
                { latitude: parseFloat(ambulance.y), longitude: parseFloat(ambulance.x) }
                ,{ unit: 'km' });
            return {...ambulance, distance: distance/1000};  // 거리를 미터 단위로 변환
        });

        // 거리가 작은 것부터 큰 순서로 정렬. distance가 null인 경우 가장 큰 값으로 간주
        const sortedAmbulanceData = ambulanceDataWithDistance.sort((a, b) => {
            if (a.distance === null) {
                return 1;
            }
            if (b.distance === null) {
                return -1;
            }
            return a.distance - b.distance;
        });

        res.json(sortedAmbulanceData);
    } catch (error) {
        console.error('Failed to process emergency data:', error);
        res.status(500).json({ error: 'Failed to retrieve emergency data' });
    }
}



// 가장 가까운 구급차 하나의 전화번호
export async function getNearestAmbulance(req, res) {
    try {
        const { userLatitude, userLongitude } = req.body;

        const ambulanceData = await Ambulance.find({ x: { $exists: true }, y: { $exists: true } }).lean();
        const ambulanceDataWithDistance = ambulanceData.map((ambulance) => {
            // Haversine 공식을 사용하여 두 지점 사이의 거리 계산
            const distance = haversine(
                { latitude: userLatitude, longitude: userLongitude },
                { latitude: parseFloat(ambulance.y), longitude: parseFloat(ambulance.x) }
                ,{ unit: 'km' });
            return {...ambulance, distance: distance/1000};  // 거리를 미터 단위로 변환
        });

        // 거리가 작은 것부터 큰 순서로 정렬. distance가 null인 경우 가장 큰 값으로 간주
        const sortedAmbulanceData = ambulanceDataWithDistance.sort((a, b) => {
            if (a.distance === null) {
                return 1;
            }
            if (b.distance === null) {
                return -1;
            }
            return a.distance - b.distance;
        });

        res.json(sortedAmbulanceData[0].onrTel);
    } catch (error) {
        console.error('Failed to process emergency data:', error);
        res.status(500).json({ error: 'Failed to retrieve emergency data' });
    }
}
