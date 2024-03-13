import Mongoose from "mongoose";
import fetch from "node-fetch"
import { parseString } from "xml2js";
import haversine from "haversine";

const pharmacySchema = new Mongoose.Schema({
    dutyTime1Mon: String,
    dutyTime2Tue: String,
    dutyTime3Wed: String,
    dutyTime4Thu: String,
    dutyTime5Fri: String,
    dutyTime6Sat: String,
    dutyTime7Sun: String,
    dutyTime8Hol: String,
    dutyAddr: String,
    dutyEtc: String,
    dutyInf: String,
    dutyMapimg: String,
    dutyName: String,
    dutyTel1: String,
    hpid: String,
    postCdn1: String,
    postCdn2: String,
    wgs84Lat: String,
    wgs84Lon: String,
});

const Pharmacy = Mongoose.model('pharmacy', pharmacySchema);   

function combineDaysAndTime(start, end) {
    try{
        return `${start[0]}${start[1]}:${start[2]}${start[3]}-${end[0]}${end[1]}:${end[2]}${end[3]}`
    }catch(error){
        console.error(error)
    }
}


const cityMapping = {
    '서울특별시': 'Seoul_Pharmacies',
    '부산광역시': 'Busan_Pharmacies',
    '대구광역시': 'Daegu_Pharmacies',
    '인천광역시': 'Incheon_Pharmacies',
    '광주광역시': 'Gwangju_Pharmacies',
    '대전광역시': 'Daejeon_Pharmacies',
    '울산광역시': 'Ulsan_Pharmacies',
    '세종특별자치시': 'Sejong_Pharmacies',
    '경기도': 'Gyeonggi_Pharmacies',
    '강원특별자치도': 'Gangwon_Pharmacies',
    '충청북도': 'Chungbuk_Pharmacies',
    '충청남도': 'Chungnam_Pharmacies',
    '전라북도': 'Jeonbuk_Pharmacies',
    '전라남도': 'Jeonnam_Pharmacies',
    '경상북도': 'Gyeongbuk_Pharmacies',
    '경상남도': 'Gyeongnam_Pharmacies',
    '제주특별자치도': 'Jeju_Pharmacies'
};

export async function setPharmacyDataByCityArray() {

    let pageNo = 1;
    
    while (true) {
        try{
            const response = await fetch(`https://apis.data.go.kr/B552657/ErmctInsttInfoInqireService/getParmacyFullDown?serviceKey=MFQhV%2FZRnUepzJxZ%2BHB1FIHAiJdEcnbf5n8u3Jc2UoLAbkogcZekWtdQyVAU7NeMGScZlxkyD%2BZfDvfLyp%2BEVA%3D%3D&pageNo=${pageNo}&numOfRows=1000`, { method: 'GET' });
            const xmldata = await response.text();
            let datas;
            parseString(xmldata, async (err, result) => {
                const items = result.response.body[0].items[0].item;
                datas = items;

                // 여기에서 데이터 하나씩 처리 가능
                for (var i = 0; i < datas.length; i++) {
                    const data = datas[i];
                    // 여기서 정제
                    const pharmacyDetail = {
                        hpid: data.hpid[0],
                        dutyTime1Mon: (data.dutyTime1s && data.dutyTime1c) ? combineDaysAndTime(data.dutyTime1s[0], data.dutyTime1c[0]) : '-',
                        dutyTime2Tue: (data.dutyTime2s && data.dutyTime2c) ? combineDaysAndTime(data.dutyTime2s[0], data.dutyTime2c[0]) : '-',
                        dutyTime3Wed: (data.dutyTime3s && data.dutyTime3c) ? combineDaysAndTime(data.dutyTime3s[0], data.dutyTime3c[0]) : '-',
                        dutyTime4Thu: (data.dutyTime4s && data.dutyTime4c) ? combineDaysAndTime(data.dutyTime4s[0], data.dutyTime4c[0]) : '-',
                        dutyTime5Fri: (data.dutyTime5s && data.dutyTime5c) ? combineDaysAndTime(data.dutyTime5s[0], data.dutyTime5c[0]) : '-',
                        dutyTime6Sat: (data.dutyTime6s && data.dutyTime6c) ? combineDaysAndTime(data.dutyTime6s[0], data.dutyTime6c[0]) : '-',
                        dutyTime7Sun: (data.dutyTime7s && data.dutyTime7c) ? combineDaysAndTime(data.dutyTime7s[0], data.dutyTime7c[0]) : '-',
                        dutyTime8Hol: (data.dutyTime8s && data.dutyTime8c) ? combineDaysAndTime(data.dutyTime8s[0], data.dutyTime8c[0]) : '-',
                        dutyAddr: data.dutyAddr && data.dutyAddr[0]?.trim() || null,
                        dutyEtc: data.dutyEtc && data.dutyEtc[0]?.trim() || null,
                        dutyInf: data.dutyInf && data.dutyInf[0]?.trim() || null,
                        dutyMapimg: data.dutyMapimg && data.dutyMapimg[0]?.trim() || null,
                        dutyName: data.dutyName && data.dutyName[0]?.trim() || null,
                        dutyTel1: data.dutyTel1 && data.dutyTel1[0]?.trim() || null,
                        postCdn1: data.postCdn1 && data.postCdn1[0]?.trim() || null,
                        postCdn2: data.postCdn2 && data.postCdn2[0]?.trim() || null,
                        wgs84Lat: data.wgs84Lat && data.wgs84Lat[0]?.trim() || null,
                        wgs84Lon: data.wgs84Lon && data.wgs84Lon[0]?.trim() || null
                    };

                    // 데이터의 dutyAddr에 도시 정보가 있는지 확인
                    const cityInAddress = Object.keys(cityMapping).find(city => data.dutyAddr[0]?.includes(city));

                    if (cityInAddress) {
                        // 해당 도시의 컬렉션 이름 생성
                        const collectionName = `${cityMapping[cityInAddress]}`;

                        // 해당 도시의 컬렉션에 데이터 저장
                        const CityPharmacy = Mongoose.model(collectionName, pharmacySchema); // 사용 중인 스키마에 맞게 수정 필요
                        await CityPharmacy.findOneAndUpdate(
                            { hpid: pharmacyDetail.hpid },
                            pharmacyDetail,
                            { new: true, upsert: true }
                        );
                    }
                }
            });
        }catch(error){
            console.error(error)
        }
    try{
        if (datas.length < 1000) {
            break;
        } else {
            // pageNo 증가
            console.log(pageNo);
            pageNo++;
        }
    }catch(error){
        console.error(error)
    }
    }   
}

async function findPharmacyInDB(cityList, inputHpid) {
    try{
    for(const city of cityList){
        const collectionName = cityMapping[city.city]

        // 해당 도시의 컬렉션에 데이터 저장
        const CityPharmacy = Mongoose.model(collectionName, pharmacySchema)
        const originData = await CityPharmacy.findOne({ hpid: inputHpid })
        if (originData) {
            return originData
        }
    }
    }catch(error){
        console.error(error)
    }
}


// 현위치 기준으로 주변 약국 영업중인 약국 가져오기
let latitude
let longitude
export async function getNearOpenPharmacy(userLat, userLon, count, cityList) {
    let openCheck = []
    if (userLat) {
        latitude = userLat
        longitude = userLon
    }
    try {
        // 현위치 기준 현재 영업중인 가까운 약국 가져오기
        const apiUrl = `https://apis.data.go.kr/B552657/ErmctInsttInfoInqireService/getParmacyLcinfoInqire?serviceKey=MFQhV%2FZRnUepzJxZ%2BHB1FIHAiJdEcnbf5n8u3Jc2UoLAbkogcZekWtdQyVAU7NeMGScZlxkyD%2BZfDvfLyp%2BEVA%3D%3D&WGS84_LON=${longitude}&WGS84_LAT=${latitude}&pageNo=1&numOfRows=${count}`;
        console.log(apiUrl);
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const xmldata = await response.text();
        let items 
        parseString(xmldata, (err, result) => {
            // items가 없는 경우, 즉 약국 정보가 없는 경우 이후의 처리를 하지 않습니다.
            if (!result.response.body[0].items[0].item) {
                return;
            }
            
            items = result.response.body[0].items[0].item
        });

            for (let i = 0; i < items.length ; i++) {

                const originData = await findPharmacyInDB(cityList,items[i].hpid[0])
                
                if (originData) {
                    const newData = {
                        ...originData.toObject(),
                        endTime: items[i].endTime[0],
                        distance: items[i].distance[0],
                        openNow : true
                    };
                    openCheck.push(newData);
                }else{
                    console.log('db에서 못찾음')
                }
            }
        
        return openCheck
    } catch (error) {
        console.error('Error fetching pharmacy data:', error.message)
    }
}

// 전체 약국데이터 가져오기
let openPharmacy = []
export async function getAllPharmacy(latitude, longitude, socket) {
    console.log(latitude, longitude ,'기준으로 getAllPharmacy 실행');
    try{
    const nearestCityList = findNearestCityList(latitude, longitude);
    let top500Pharmacy = [];  // 초기화

    // getNearOpenPharmacy 함수 실행
    const openPharmacy1 = await getNearOpenPharmacy(latitude, longitude, 100, nearestCityList);
    socket.emit('updatePharmacy', openPharmacy1);
    openPharmacy = await getNearOpenPharmacy(latitude, longitude, 500, nearestCityList);
    if(!openPharmacy){
        socket.emit('updatePharmacy', openPharmacy1);
    }else{
        socket.emit('updatePharmacy', openPharmacy);
    }
    }catch(error){
        console.log(error)
    }
    try{
    for (const city of nearestCityList) {
        console.log(city,'시작');
        const modelName = cityMapping[city.city];
        const PharmacyModel = Mongoose.model(modelName, pharmacySchema);
        const pharmacyList = await PharmacyModel.find({});
        console.log(city,'DB데이터 추출 완료, 거리 계산 시작');
        let pharmacyWithDistance = pharmacyList.map(pharmacy => {
            const pharmacyCoord = { latitude: parseFloat(pharmacy.wgs84Lat), longitude: parseFloat(pharmacy.wgs84Lon) };
            const distance = parseFloat(haversine({ latitude, longitude }, pharmacyCoord, { unit: 'km' }))
            return { ...pharmacy.toObject(), distance : distance, openNow: false };
        });


        // 거리를 기준으로 오름차순 정렬
        pharmacyWithDistance.sort((a, b) => a.distance - b.distance);

        // 상위 500개만 선택
        pharmacyWithDistance = pharmacyWithDistance.slice(0, 500);

        // 겹치는 약국 삭제
        if (openPharmacy) {
             pharmacyWithDistance = pharmacyWithDistance.filter(pharmacy => !openPharmacy.some(open => open.hpid === pharmacy.hpid));
        }
       

        // top500Pharmacy와 pharmacyWithDistance를 합치고 다시 정렬
        top500Pharmacy = [...pharmacyWithDistance, ...top500Pharmacy];
        top500Pharmacy.sort((a, b) => a.distance - b.distance);
        top500Pharmacy = top500Pharmacy.slice(0, 500);
        if (openPharmacy) {
            top500Pharmacy = [...top500Pharmacy,...openPharmacy]
        }
        
        top500Pharmacy.sort((a, b) => a.distance - b.distance);

        // socket으로 결과 전송
        socket.emit('updatePharmacy', top500Pharmacy);
    }
    }catch(error){
        console.error(error)
    }
    try{
    if(openPharmacy && openPharmacy.length === 100){
        const openPharmacy2 = await getNearOpenPharmacy(latitude, longitude, 1000);
        top500Pharmacy = top500Pharmacy.filter(pharmacy => !openPharmacy2.some(open => open.hpid === pharmacy.hpid));

        // top500Pharmacy와 pharmacyWithDistance를 합치고 다시 정렬
        top500Pharmacy = [...top500Pharmacy, ...top500Pharmacy];
        top500Pharmacy.sort((a, b) => a.distance - b.distance);
        socket.emit('updatePharmacy', top500Pharmacy);

    }
    }catch(error){
        console.error(error)
    }
    
}


function findNearestCityList(targetLatitude, targetLongitude) {
    const targetCoord = { latitude: targetLatitude, longitude: targetLongitude };
    let nearestCityList = [];
    const citiesRangeLongLati = {
        '서울특별시': {'latitude': [37.4, 37.9], 'longitude': [126.7, 127.3]},
        '부산광역시': {'latitude': [35.0, 35.4], 'longitude': [128.7, 129.3]},
        '대구광역시': {'latitude': [35.6, 36.0], 'longitude': [128.3, 128.9]},
        '인천광역시': {'latitude': [37.2, 37.8], 'longitude': [126.7, 127.8]},
        '광주광역시': {'latitude': [35.1, 35.4], 'longitude': [126.8, 127.2]},
        '대전광역시': {'latitude': [36.2, 36.5], 'longitude': [127.1, 127.5]},
        '울산광역시': {'latitude': [35.4, 35.7], 'longitude': [129.0, 129.4]},
        '세종특별자치시': {'latitude': [36.3, 36.7], 'longitude': [127.1, 127.4]},
        '경기도': {'latitude': [36.0, 38.2], 'longitude': [126.5, 127.8]},
        '강원특별자치도': {'latitude': [36.4, 38.4], 'longitude': [127.5, 129.4]},
        '충청북도': {'latitude': [36.3, 37.2], 'longitude': [127.0, 127.8]},
        '충청남도': {'latitude': [36.2, 36.9], 'longitude': [126.7, 127.5]},
        '전라북도': {'latitude': [35.6, 36.6], 'longitude': [126.7, 127.5]},
        '전라남도': {'latitude': [34.8, 35.9], 'longitude': [125.8, 127.3]},
        '경상북도': {'latitude': [35.5, 36.8], 'longitude': [128.0, 129.2]},
        '경상남도': {'latitude': [34.5, 35.8], 'longitude': [127.5, 129.5]},
        '제주특별자치도': {'latitude': [33.0, 34.5], 'longitude': [126.0, 127.5]},
    };  
    
    for (const [city, { latitude, longitude }] of Object.entries(citiesRangeLongLati)) {
        try{
        const vertices = [
            { latitude: latitude[0], longitude: longitude[0] },
            { latitude: latitude[0], longitude: longitude[1] },
            { latitude: latitude[1], longitude: longitude[1] },
            { latitude: latitude[1], longitude: longitude[0] },
            { latitude: (latitude[0] + latitude[1]) / 2, longitude: (longitude[0] + longitude[1]) / 2 },
        ];
  
        const minDistance = Math.min(...vertices.map(vertex => haversine(targetCoord, vertex, { unit: 'km' })));
        const adjustedDistance = city === '경기도' ? Math.abs(minDistance - 20) : city === '서울특별시' ? Math.abs(minDistance - 5) : minDistance;

        nearestCityList.push({ city, distance: Number(adjustedDistance) });
        }catch(error){
            console.error(error)
        }
    }
  
    nearestCityList.sort((a, b) => a.distance - b.distance); // 거리를 기준으로 오름차순 정렬
    return nearestCityList.slice(0, 3); // 상위 4개만 반환함
}

// export async function getNearbyPharmacies(latitude, longitude) {
//     console.log(latitude, longitude);
//     try {
//         const result = await Pharmacy.aggregate([
//             {
//                 $geoNear: {
//                     near: {
//                         type: 'Point',
//                         coordinates: [longitude, latitude], // Ensure the correct order: [longitude, latitude]
//                     },
//                     distanceField: 'distance',
//                     maxDistance: 1000000, // 10 kilometers
//                     spherical: true,
//                 },
//             },
//         ]);

//         return result;
//     } catch (error) {
//         console.error('Error fetching nearby pharmacies:', error.message);
//         throw error;
//     }
// }


// export async function getAllPharmacy(latitude, longitude, socket) {
//     try {
        
//         // 현재 위치 기준 현재 영업중인 가까운 약국 가져오기
//         // const openPharmacy = await getNearOpenPharmacy(latitude, longitude);
//         // socket.emit('updatePharmacy', openPharmacy);

//         // 반경 10키로 이내의 약국 가져오기
//         const nearbyPharmacies = await getNearbyPharmacies(latitude, longitude);
//         console.log(nearbyPharmacies);
//         for (const pharmacy of nearbyPharmacies) {
//             const { wgs84Lat, wgs84Lon, ...rest } = pharmacy;
//             const pharmacyCoord = { latitude: wgs84Lat, longitude: wgs84Lon };
//             const distance = haversine({ latitude, longitude }, pharmacyCoord, { unit: 'km' });
//             const pharmacyWithDistance = { ...rest, distance, openNow: false };

//             // socket으로 결과 전송
//             socket.emit('updatePharmacy', pharmacyWithDistance);
//         }

//         // 현재 위치와의 거리 계산 등 추가 작업 수행
//     } catch (error) {
//         console.error('Error fetching pharmacy data:', error.message);
//     }
// }