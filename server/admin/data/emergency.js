import Mongoose from "mongoose";
import { parseString } from 'xml2js';
const columnMappingInfo = {
  // 기존필드
  dutyEmclsName:'의료기관 유형' ,
  dutyName:'의료기관명' ,
  dutyTel1:'대표 전화번호' ,
  dutyTel3:'응급실 전화번호' ,
  hpid:'기관 ID' ,
  rnum:'일련번호' ,
  wgs84Lat:'위도' ,
  wgs84Lon:'경도' ,
  dutyAddr:'주소' ,
  isRealTimeEmergencyData: '응급실 실시간 데이터 제공 여부' ,
  //getAllInfoEr로 들고올 필드들
  dutyTime1Mon:'월요일 영업시간',
  dutyTime2Tue:'화요일 영업시간',
  dutyTime3Wed:'수요일 영업시간',
  dutyTime4Thu:'목요일 영업시간',
  dutyTime5Fri:'금요일 영업시간',
  dutyTime6Sat:'토요일 영업시간',
  dutyTime7Sun:'일요일 영업시간',
  dutyTime8Hol:'공휴일 영업시간',  
  hvecNum:'응급실' ,
  hvoc:'수술실' ,
  hvcc:'신경중환자실' ,
  hvncc:'신생중환자실' ,
  hvccc:'흉부중환자실' ,
  hvicc:'일반중환자실' ,
  hvgc:'입원실' ,
  dutyHayn:'입원실가용여부(1/2)' ,
  dutyHano:'병상수' ,
  dutyInf:'기관설명상세' ,
  dutyMapimg:'간이약도' ,
  dutyEryn:'응급실운영여부(1/2)' ,
  MKioskTy25:'응급실(Emergency gate keeper)' ,
  MKioskTy1:'뇌출혈수술' ,
  MKioskTy2:'뇌경색의재관류' ,
  MKioskTy3:'심근경색의재관류' ,
  MKioskTy4:'복부손상의수술' ,
  MKioskTy5:'사지접합의수술' ,
  MKioskTy6:'응급내시경' ,
  MKioskTy7:'응급투석' ,
  MKioskTy8:'조산산모' ,
  MKioskTy9:'정신질환자' ,
  MKioskTy10:'신생아' ,
  MKioskTy11:'중증화상' ,
  dgidIdName:'진료과목' ,
  hpbdn:'병상수' ,
  hpccuyn:'흉부중환자실' ,
  hpcuyn:'신경중환자실' ,
  hperyn:'응급실' ,
  hpgryn: '입원실' ,
  hpicuyn: '일반중환자실' ,
  hpnicuyn: '신생아중환자실' ,
  hpopyn: '수술실' ,
  specialErList : '특수응급리스트',
  hpsaltCode :'암호화요양기호',
  equipmentList :'의료장비 리스트',
  // 여기서부터 실시간 리스트
  hvec:'일반병상수' ,
  hvoc:'[기타] 수술실' ,
  hvcc:'[중환자실] 신경과' ,
  hvncc:'[중환자실] 신생아' ,
  hvccc:'[중환자실] 흉부외과' ,
  hvicc:'[중환자실] 일반' ,
  hvgc:'[입원실] 일반' ,
  hvdnm:'당직의' ,
  hvctayn:'CT가용(가/부)' ,
  hvmriayn:'MRI가용(가/부)' ,
  hvangioayn:'혈관촬영기가용(가/부)' ,
  hvventiayn:'인공호흡기가용(가/부)' ,
  hvventisoayn:'인공호흡기 조산아가용(가/부)' ,
  hvincuayn:'인큐베이터가용(가/부)' ,
  hvcrrtayn:'CRRT가용(가/부)' ,
  hvecmoayn:'ECMO가용(가/부)' ,
  hvoxyayn:'고압산소치료기가용(가/부)' ,
  hvhypoayn:'중심체온조절유도기(가/부)' ,
  hvamyn:'구급차가용여부' ,
  hv1:'응급실 당직의 직통연락처' ,
  hv2:'[중환자실] 내과' ,
  hv3:'[중환자실] 외과' ,
  hv4:'외과입원실(정형외과)' ,
  hv5:'신경과입원실' ,
  hv6:'[중환자실] 신경외과' ,
  hv7:'약물중환자' ,
  hv8:'[중환자실] 화상' ,
  hv9:'[중환자실] 외상' ,
  hv10:'VENTI(소아)' ,
  hv11:'인큐베이터(보육기)' ,
  hv12:'소아당직의 직통연락처' ,
  hv13:'격리진료구역 음압격리병상' ,
  hv14:'격리진료구역 일반격리병상' ,
  hv15:'소아음압격리' ,
  hv16:'소아일반격리' ,
  hv17:'[응급전용] 중환자실 음압격리' ,
  hv18:'[응급전용] 중환자실 일반격리' ,
  hv19:'[응급전용] 입원실 음압격리' ,
  hv21:'[응급전용] 입원실 일반격리' ,
  hv22:'감염병 전담병상 중환자실' ,
  hv23:'감염병 전담병상 중환자실 내 음압격리병상' ,
  hv24:'[감염] 중증 병상' ,
  hv25:'[감염] 준-중증 병상' ,
  hv26:'[감염] 중등증 병상' ,
  hv27:'코호트 격리' ,
  hv28:'소아' ,
  hv29:'응급실 음압 격리 병상' ,
  hv30:'응급실 일반 격리 병상' ,
  hv31:'[응급전용] 중환자실' ,
  hv32:'[중환자실] 소아' ,
  hv33:'[응급전용] 소아중환자실' ,
  hv34:'[중환자실] 심장내과' ,
  hv35:'[중환자실] 음압격리' ,
  hv36:'[응급전용] 입원실' ,
  hv37:'[응급전용] 소아입원실' ,
  hv38:'[입원실] 외상전용' ,
  hv39:'[기타] 외상전용 수술실' ,
  hv40:'[입원실] 정신과 폐쇄병동' ,
  hv41:'[입원실] 음압격리' ,
  hv42:'[기타] 분만실' ,
  hv43:'[기타] 화상전용처치실' ,
  HVS01:'일반_기준' ,
  HVS02:'소아_기준' ,
  HVS03:'응급실 음압 격리 병상_기준' ,
  HVS04:'응급실 일반 격리 병상_기준' ,
  HVS05:'[응급전용] 중환자실_기준' ,
  HVS06:'[중환자실] 내과_기준' ,
  HVS07:'[중환자실] 외과_기준' ,
  HVS08:'[중환자실] 신생아_기준' ,
  HVS09:'[중환자실] 소아_기준' ,
  HVS10:'[응급전용] 소아중환자실_기준' ,
  HVS11:'[중환자실] 신경과_기준' ,
  HVS12:'[중환자실] 신경외과_기준' ,
  HVS13:'[중환자실] 화상_기준' ,
  HVS14:'[중환자실] 외상_기준' ,
  HVS15:'[중환자실] 심장내과_기준' ,
  HVS16:'[중환자실] 흉부외과_기준' ,
  HVS17:'[중환자실] 일반_기준' ,
  HVS18:'[중환자실] 음압격리_기준' ,
  HVS19:'[응급전용] 입원실_기준' ,
  HVS20:'[응급전용] 소아입원실_기준' ,
  HVS21:'[입원실] 외상전용_기준' ,
  HVS22:'[기타] 수술실_기준' ,
  HVS23:'[기타] 외상전용 수술실_기준' ,
  HVS24:'[입원실] 정신과 폐쇄병동_기준' ,
  HVS25:'[입원실] 음압격리_기준' ,
  HVS26:'[기타] 분만실_기준' ,
  HVS27:'CT_기준' ,
  HVS28:'MRI_기준' ,
  HVS29:'혈관촬영기_기준' ,
  HVS30:'인공호흡기 일반_기준' ,
  HVS31:'인공호흡기 조산아_기준' ,
  HVS32:'인큐베이터_기준' ,
  HVS33:'CRRT_기준' ,
  HVS34:'ECMO_기준' ,
  HVS35:'중심체온조절유도기_기준' ,
  HVS36:'[기타] 화상전용처치실_기준' ,
  HVS37:'고압산소치료기_기준' ,
  HVS38:'[입원실] 일반_기준' ,
  HVS46:'격리진료구역 음압격리_기준' ,
  HVS47:'격리진료구역 일반격리_기준' ,
  HVS48:'소아음압격리_기준' ,
  HVS49:'소아일반격리_기준' ,
  HVS50:'[응급전용] 중환자실 음압격리_기준' ,
  HVS51:'[응급전용] 중환자실 일반격리_기준' ,
  HVS52:'[응급전용] 입원실 음압격리_기준' ,
  HVS53:'[응급전용] 입원실 일반격리_기준' ,
  HVS54:'감염병 전담병상 중환자실_기준' ,
  HVS55:'감염병 전담병상 중환자실 내 음압격리병상_기준' ,
  HVS56:'[감염] 중증 병상_기준' ,
  HVS57:'[감염] 준-중증 병상_기준' ,
  HVS58:'[감염] 중등증 병상_기준' ,
  HVS59:'코호트 격리_기준' 
};

const Emergency = Mongoose.model('Emergency', new Mongoose.Schema({
  dutyEmclsName: String,
  dutyName: String,
  dutyTel1: String,
  dutyTel3: String,
  hpid: String,
  rnum: String,
  wgs84Lat: String,
  wgs84Lon: String,
  dutyAddr: String,
  isRealTimeEmergencyData: Boolean,
  dutyTime1Mon: String,
  dutyTime2Tue: String,
  dutyTime3Wed: String,
  dutyTime4Thu: String,
  dutyTime5Fri: String,
  dutyTime6Sat: String,
  dutyTime7Sun: String,
  dutyTime8Hol : String,
  clinicMonday: String,
  clinicTuesday: String,
  clinicWednesday: String,
  clinicThursday: String,
  clinicFriday: String,
  clinicSaturday: String,
  clinicSunday: String,
  clinicHoliday: String,
  hvecNum: String,
  hvoc: String,
  hvcc: String,
  hvncc: String,
  hvccc: String,
  hvicc: String,
  hvgc: String,
  dutyHayn: String,
  dutyHano: String,
  dutyInf: String,
  dutyMapimg: String,
  dutyEryn: String,
  MKioskTy25: String,
  MKioskTy1: String,
  MKioskTy2: String,
  MKioskTy3: String,
  MKioskTy4: String,
  MKioskTy5: String,
  MKioskTy6: String,
  MKioskTy7: String,
  MKioskTy8: String,
  MKioskTy9: String,
  MKioskTy10: String,
  MKioskTy11: String,
  wgs84Lon: String,
  wgs84Lat: String,
  dgidIdName: String,
  hpbdn: String,
  hpccuyn: String,
  hpcuyn: String,
  hperyn: String,
  hpgryn: String,
  hpicuyn: String,
  hpnicuyn: String,
  hpopyn: String,
  specialErList : String,
  hpsaltCode : String,
  equipmentList : String
}));


const apiUrl = 'http://apis.data.go.kr/B552657/ErmctInfoInqireService/getEgytListInfoInqire';
const serviceKey = 'MFQhV%2FZRnUepzJxZ%2BHB1FIHAiJdEcnbf5n8u3Jc2UoLAbkogcZekWtdQyVAU7NeMGScZlxkyD%2BZfDvfLyp%2BEVA%3D%3D';

const fetchAndGetData = async (url) => {
  try {
    const response = await fetch(url, { method: 'GET' });

    if (!response.ok) {
      throw new Error('네트워크 응답이 올바르지 않습니다');
    }

    return response.text();
  } catch (error) {
    console.error('데이터 가져오기 중 에러 발생:', error.message);
    throw new Error('데이터를 가져오는 중 에러가 발생했습니다.');
  }
};

export async function getAllCitiesEr() {
  try {
    const cities = ['서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시', '대전광역시', '울산광역시', '세종특별자치시', '경기도', '강원특별자치도', '충청북도', '충청남도', '전라북도', '전라남도', '경상북도', '경상남도', '제주특별자치도'];

    for (const city of cities) {
      const response = await fetch(`https://apis.data.go.kr/B552657/ErmctInfoInqireService/getEgytListInfoInqire?serviceKey=MFQhV%2FZRnUepzJxZ%2BHB1FIHAiJdEcnbf5n8u3Jc2UoLAbkogcZekWtdQyVAU7NeMGScZlxkyD%2BZfDvfLyp%2BEVA%3D%3D&Q0=${city}&pageNo=1&numOfRows=1000`, { method: 'GET' });
      const xmldata = await response.text();
      parseString(xmldata, async (err, result) => {
        if (err) {
          throw err;
        }

        const items = result.response.body[0].items[0].item;

        for (const data of items) {
          const emergencyData = {
            hpid: data.hpid[0],
            dutyEmclsName: emptyHandling(data.dutyEmclsName),
            dutyName: emptyHandling(data.dutyName),
            dutyTel1: emptyHandling(data.dutyTel1),
            dutyTel3: data.dutyTel3 && data.dutyTel3[0]?.trim() || data.dutyTel1[0],
            rnum: emptyHandling(data.rnum),
            wgs84Lat: emptyHandling(data.wgs84Lat),
            wgs84Lon: emptyHandling(data.wgs84Lon),
            dutyAddr: emptyHandling(data.dutyAddr),
            isRealTimeEmergencyData: !data.dutyEmclsName[0].includes('응급의료시설')
          };

          await Emergency.findOneAndUpdate(
            { hpid: emergencyData.hpid },
            emergencyData,
            { upsert: true }
          );
        }
      });
    }
  } catch (error) {
    console.error('도시별 응급의료시설 데이터 가져오기 중 에러 발생:', error.message);
    throw new Error('도시별 응급의료시설 데이터를 가져오는 중 에러가 발생했습니다.');
  }
}


// 기본정보 추가
export async function getAllInfoEr() {
  try {
    const allEmergencies = await Emergency.find({}, 'hpid'); // 데이터베이스에서 모든 hpid를 가져옴
    for (const emergency of allEmergencies) {
      try {
        await getAllInfoErTest(emergency.hpid);
      } catch (error) {
        console.error(`${emergency.hpid} 데이터 추가 중 에러 발생:`, error.message);
      }
    }
  } catch (error) {
    console.error('기본정보 추가 중 에러 발생:', error.message);
  }
}

function combineDaysAndTime(start, end) {
  try {
    return `${start[0]}${start[1]}:${start[2]}${start[3]}-${end[0]}${end[1]}:${end[2]}${end[3]}`;
  } catch (error) {
    console.error('날짜와 시간을 결합하는 중 에러 발생:', error.message);
    throw new Error('날짜와 시간을 결합하는 중 에러가 발생했습니다.');
  }
}

export async function getAllInfoErTest(hpid) {
  try {
    const url = `https://apis.data.go.kr/B552657/ErmctInfoInqireService/getEgytBassInfoInqire?serviceKey=MFQhV%2FZRnUepzJxZ%2BHB1FIHAiJdEcnbf5n8u3Jc2UoLAbkogcZekWtdQyVAU7NeMGScZlxkyD%2BZfDvfLyp%2BEVA%3D%3D&HPID=${hpid}&pageNo=1&numOfRows=10`;

    const response = await fetch(url, { method: 'GET' });
    const responseParse = await response.text();

    parseString(responseParse, async (err, result) => {
      if (err) {
        throw err;
      }

      const data = result.response.body[0].items[0].item[0];
      const emergencyData = {
        hpid: data.hpid[0],
        dutyTime1Mon: (data.dutyTime1s && data.dutyTime1c) ? combineDaysAndTime(data.dutyTime1s[0], data.dutyTime1c[0]) : '-',
        dutyTime2Tue: (data.dutyTime2s && data.dutyTime2c) ? combineDaysAndTime(data.dutyTime2s[0], data.dutyTime2c[0]) : '-',
        dutyTime3Wed: (data.dutyTime3s && data.dutyTime3c) ? combineDaysAndTime(data.dutyTime3s[0], data.dutyTime3c[0]) : '-',
        dutyTime4Thu: (data.dutyTime4s && data.dutyTime4c) ? combineDaysAndTime(data.dutyTime4s[0], data.dutyTime4c[0]) : '-',
        dutyTime5Fri: (data.dutyTime5s && data.dutyTime5c) ? combineDaysAndTime(data.dutyTime5s[0], data.dutyTime5c[0]) : '-',
        dutyTime6Sat: (data.dutyTime6s && data.dutyTime6c) ? combineDaysAndTime(data.dutyTime6s[0], data.dutyTime6c[0]) : '-',
        dutyTime7Sun: (data.dutyTime7s && data.dutyTime7c) ? combineDaysAndTime(data.dutyTime7s[0], data.dutyTime7c[0]) : '-',
        dutyTime8Hol: (data.dutyTime8s && data.dutyTime8c) ? combineDaysAndTime(data.dutyTime8s[0], data.dutyTime8c[0]) : '-',
        hvecNum: emptyHandling(data.hvec),
        hvoc: emptyHandling(data.hvoc),
        hvcc: emptyHandling(data.hvcc),
        hvncc: emptyHandling(data.hvncc),
        hvccc: emptyHandling(data.hvccc),
        hvicc: emptyHandling(data.hvicc),
        hvgc: emptyHandling(data.hvgc),
        dutyHayn: emptyHandling(data.dutyHayn),
        dutyHano: emptyHandling(data.dutyHano),
        dutyInf: emptyHandling(data.dutyInf),
        dutyMapimg: emptyHandling(data.dutyMapimg),
        dutyEryn: emptyHandling(data.dutyEryn),
        MKioskTy25: emptyHandling(data.MKioskTy25),
        MKioskTy1: emptyHandling(data.MKioskTy1),
        MKioskTy2: emptyHandling(data.MKioskTy2),
        MKioskTy3: emptyHandling(data.MKioskTy3),
        MKioskTy4: emptyHandling(data.MKioskTy4),
        MKioskTy5: emptyHandling(data.MKioskTy5),
        MKioskTy6: emptyHandling(data.MKioskTy6),
        MKioskTy7: emptyHandling(data.MKioskTy7),
        MKioskTy8: emptyHandling(data.MKioskTy8),
        MKioskTy9: emptyHandling(data.MKioskTy9),
        MKioskTy10: emptyHandling(data.MKioskTy10),
        MKioskTy11: emptyHandling(data.MKioskTy11),
        dgidIdName: emptyHandling(data.dgidIdName),
        hpbdn: emptyHandling(data.hpbdn),
        hpccuyn: emptyHandling(data.hpccuyn),
        hpcuyn: emptyHandling(data.hpcuyn),
        hperyn: emptyHandling(data.hperyn),
        hpgryn: emptyHandling(data.hpgryn),
        hpicuyn: emptyHandling(data.hpicuyn),
        hpnicuyn: emptyHandling(data.hpnicuyn),
        hpopyn: emptyHandling(data.hpopyn),
      };

      const updateResult = await Emergency.findOneAndUpdate(
        { hpid: emergencyData.hpid },
        emergencyData,
        { new: true }
      );
      return updateResult;
    });
  } catch (error) {
    console.error(`${hpid}의 기본정보 추가 중 에러 발생:`, error.message);
    throw new Error('기본정보를 추가하는 중 에러가 발생했습니다.');
  }
}

import XLSX from 'xlsx';
// import fs from 'fs';


export async function insertSpecialEr() {
  try {
    // 파일 읽기
    const workbook = XLSX.readFile('./GuphaniData.xlsx');

    // 세 번째 시트 선택 (시트는 0부터 시작)
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // 시트 데이터 읽기
    const datas = XLSX.utils.sheet_to_json(worksheet);

    // hpsaltCode를 기준으로 데이터를 그룹화
    const groupedData = datas.reduce((result, item) => {
      const key = item['암호화요양기호']; // hpsaltCode를 키로 사용

      // 이미 해당 그룹이 존재하는지 확인하고 없으면 새로운 Set과 빈 문자열 생성
      if (!result[key]) {
        result[key] = { 암호화요양기호: key, 검색코드명: '' }; // hpsaltCode를 key로 사용
      }

      // 검색코드명을 ,로 구분해서 추가
      if (result[key]['검색코드명'].length > 0) {
        result[key]['검색코드명'] += ',';
      }
      result[key]['검색코드명'] += item['검색코드명'];

      return result;
    }, {});

    // Set을 다시 배열로 변환하고 결과 출력
    const finalResult = Object.values(groupedData);

    // hpsaltCode를 기준으로 업데이트 수행
    await Promise.all(finalResult.map(async (hospitalData) => {
      const { 암호화요양기호, 검색코드명 } = hospitalData;

      // Emergency에서 해당 hpsaltCode를 찾아 업데이트 수행
      await Emergency.findOneAndUpdate(
        { hpsaltCode: 암호화요양기호 },
        { $set: { specialErList: 검색코드명 } },
        { new: true }
      );
    }));
  } catch (error) {
    console.error('특수응급실 데이터 삽입 중 에러 발생:', error.message);
    throw new Error('특수응급실 데이터를 삽입하는 중 에러가 발생했습니다.');
  }
}

export async function insertSaltCode() {
  try {
    const existingHospitals = await Emergency.find({});
    const workbook = XLSX.readFile('./1.병원정보서비스.xlsx');
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const workbookData = XLSX.utils.sheet_to_json(worksheet, { header: ['암호화요양기호', '요양기관명'] });

    for (const { dutyName, hpsaltCode: existingHpsaltCode } of existingHospitals) {
      const workbookHospital = workbookData.find(hospital => hospital.요양기관명 === dutyName) || workbookData.find(hospital => hospital.요양기관명.replace(' ', '') === dutyName);

      if (workbookHospital && existingHpsaltCode !== workbookHospital.암호화요양기호) {
        const updatedDocument = await Emergency.findOneAndUpdate(
          { dutyName: dutyName },
          { $set: { hpsaltCode: workbookHospital.암호화요양기호 } },
          { new: true }
        );
      }
    }
  } catch (error) {
    console.error('암호화요양기호 삽입 중 에러 발생:', error.message);
    throw new Error('암호화요양기호를 삽입하는 중 에러가 발생했습니다.');
  }
}

export async function insertEquipment() {
  try {
    const workbook = XLSX.readFile('./7.의료기관별상세정보서비스_05_의료장비정보.xlsx');
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const datas = XLSX.utils.sheet_to_json(worksheet);

    // MongoDB에서 모든 병원의 암호화요양기호 가져오기
    const existingHospitals = await Emergency.find({}, 'hpsaltCode');
    const hpsaltCodesInDB = existingHospitals.map(hospital => hospital.hpsaltCode);

    // 몽구스에서 가져온 암호화요양기호로 필터링하여 그룹화
    const groupedData = datas.reduce((result, item) => {
      const key = item['암호화요양기호'];

      if (hpsaltCodesInDB.includes(key)) {
        if (!result[key]) {
          result[key] = { 장비코드명: new Set() };
        }
        result[key]['장비코드명'].add(item['장비코드명']);
      }

      return result;
    }, {});

    const updatePromises = [];

    for (const key in groupedData) {
      const hpsaltCode = key;
      const equipmentList = Array.from(groupedData[key]['장비코드명']).join(', ');

      const updatePromise = Emergency.findOneAndUpdate(
        { hpsaltCode },
        { $set: { equipmentList } },
        { new: true }
      );

      updatePromises.push(updatePromise);
    }

    const updatedDocuments = await Promise.all(updatePromises);

    updatedDocuments.forEach((updatedDocument, index) => {
      const hpsaltCode = Object.keys(groupedData)[index];
      const equipmentList = Array.from(groupedData[hpsaltCode]['장비코드명']).join(', ');
    });
  } catch (error) {
    console.error('의료장비 정보 삽입 중 에러 발생:', error.message);
    throw new Error('의료장비 정보를 삽입하는 중 에러가 발생했습니다.');
  }
}

import haversine from 'haversine';
const citiesRangeLongLati = {
  '서울특별시': {'latitude': [37.4, 37.9], 'longitude': [126.7, 127.3]},
  '부산광역시': {'latitude': [35.0, 35.4], 'longitude': [128.7, 129.3]},
  '대구광역시': {'latitude': [35.6, 36.0], 'longitude': [128.3, 128.9]},
  '인천광역시': {'latitude': [37.2, 37.8], 'longitude': [126.7, 127.8]},
  '광주광역시': {'latitude': [35.1, 35.4], 'longitude': [126.8, 127.2]},
  '대전광역시': {'latitude': [36.2, 36.5], 'longitude': [127.1, 127.5]},
  '울산광역시': {'latitude': [35.4, 35.7], 'longitude': [129.0, 129.4]},
  '세종특별자치시': {'latitude': [36.3, 36.7], 'longitude': [127.1, 127.4]},
  '경기도': {'latitude': [37.0, 38.2], 'longitude': [126.5, 127.8]},
  '강원특별자치도': {'latitude': [36.4, 38.4], 'longitude': [127.5, 129.4]},
  '충청북도': {'latitude': [36.3, 37.2], 'longitude': [127.0, 127.8]},
  '충청남도': {'latitude': [36.2, 36.9], 'longitude': [126.7, 127.5]},
  '전라북도': {'latitude': [35.6, 36.6], 'longitude': [126.7, 127.5]},
  '전라남도': {'latitude': [34.8, 35.9], 'longitude': [125.8, 127.3]},
  '경상북도': {'latitude': [35.5, 36.8], 'longitude': [128.0, 129.2]},
  '경상남도': {'latitude': [34.5, 35.8], 'longitude': [127.5, 129.5]},
  '제주특별자치도': {'latitude': [33.0, 34.5], 'longitude': [126.0, 127.5]},
};
function findNearestCityList(targetLatitude, targetLongitude) {
  try {
    const targetCoord = { latitude: targetLatitude, longitude: targetLongitude };
    let nearestCityList = [];

    for (const [city, { latitude, longitude }] of Object.entries(citiesRangeLongLati)) {
      const vertices = [
        { latitude: latitude[0], longitude: longitude[0] },
        { latitude: latitude[0], longitude: longitude[1] },
        { latitude: latitude[1], longitude: longitude[1] },
        { latitude: latitude[1], longitude: longitude[0] },
        { latitude: (latitude[0] + latitude[1]) / 2, longitude: (longitude[0] + longitude[1]) / 2 },
      ];

      const minDistance = Math.min(...vertices.map(vertex => haversine(targetCoord, vertex, { unit: 'km' })));
      nearestCityList.push({ city, distance: minDistance });
    }

    nearestCityList.sort((a, b) => a.distance - b.distance); // 거리를 기준으로 오름차순 정렬
    return nearestCityList;
  } catch (error) {
    console.error('가까운 도시 목록 찾기 중 에러 발생:', error.message);
    throw new Error('가까운 도시 목록을 찾는 중 에러가 발생했습니다.');
  }
}
export async function realTimeEr(targetLatitude, targetLongitude, socket) {
  const latitude = parseFloat(targetLatitude);
  const longitude = parseFloat(targetLongitude);
  let FinalErList = [];

  const citiesSort = findNearestCityList(latitude, longitude);
  const realTimeKeyList = [ 'hvec', 'hvoc', 'hvcc', 'hvncc', 'hvccc', 'hvicc', 'hvgc', 'hvdnm', 'hvctayn', 'hvmriayn', 'hvangioayn', 'hvventiayn', 'hvventisoayn', 'hvincuayn', 'hvcrrtayn', 'hvecmoayn', 'hvoxyayn', 'hvhypoayn', 'hvamyn', 'hv1', 'hv2', 'hv3', 'hv4', 'hv5', 'hv6', 'hv7', 'hv8', 'hv9', 'hv10', 'hv11', 'hv12', 'hv13', 'hv14', 'hv15', 'hv16', 'hv17', 'hv18', 'hv19', 'hv21', 'hv22', 'hv23', 'hv24', 'hv25', 'hv26', 'hv27', 'hv28', 'hv29', 'hv30', 'hv31', 'hv32', 'hv33', 'hv34', 'hv35', 'hv36', 'hv37', 'hv38', 'hv39', 'hv40', 'hv41', 'hv42', 'hv43', 'HVS01', 'HVS02', 'HVS03', 'HVS04', 'HVS05', 'HVS06', 'HVS07', 'HVS08', 'HVS09', 'HVS10', 'HVS11', 'HVS12', 'HVS13', 'HVS14', 'HVS15', 'HVS16', 'HVS17', 'HVS18', 'HVS19', 'HVS20', 'HVS21', 'HVS22', 'HVS23', 'HVS24', 'HVS25', 'HVS26', 'HVS27', 'HVS28', 'HVS29', 'HVS30', 'HVS31', 'HVS32', 'HVS33', 'HVS34', 'HVS35', 'HVS36', 'HVS37', 'HVS38', 'HVS46', 'HVS47', 'HVS48', 'HVS49', 'HVS50', 'HVS51', 'HVS52', 'HVS53', 'HVS54', 'HVS55', 'HVS56', 'HVS57', 'HVS58', 'HVS59'];

  // 모든 응급실 데이터를 불러옵니다.
  const allErData = await Emergency.find({});

  // 거리에 따라 응급실 데이터를 정렬합니다.
  FinalErList = allErData.sort((a, b) => {
    const distanceA = haversine(
      { latitude: parseFloat(a.wgs84Lat), longitude: parseFloat(a.wgs84Lon) },
      { latitude: latitude, longitude: longitude },
      { unit: 'km' }
    );

    const distanceB = haversine(
      { latitude: parseFloat(b.wgs84Lat), longitude: parseFloat(b.wgs84Lon) },
      { latitude: latitude, longitude: longitude },
      { unit: 'km' }
    );

    return distanceA - distanceB;
  });

  // 정렬된 응급실 데이터를 한 번에 소켓을 통해 보냅니다.
  socket.emit('updateData', FinalErList);

  for (const city of citiesSort) {
    const url = `https://apis.data.go.kr/B552657/ErmctInfoInqireService/getEmrrmRltmUsefulSckbdInfoInqire?serviceKey=MFQhV%2FZRnUepzJxZ%2BHB1FIHAiJdEcnbf5n8u3Jc2UoLAbkogcZekWtdQyVAU7NeMGScZlxkyD%2BZfDvfLyp%2BEVA%3D%3D&STAGE1=${city.city}&pageNo=1&numOfRows=1000`;
  
    try {
      // console.log(city.city);
  
      const xmldata = await fetchDataWithRetry(url, city.city);
  
      parseString(xmldata, (err, result) => {
        if (err) {
          console.error(`Error parsing data for ${city.city}:`, err);
          return; // 해당 도시에서 발생한 오류는 무시하고 다음 도시로 계속 진행
        }
  
        const items = result?.response?.body?.[0]?.items?.[0]?.item || [];
  
        for (const item of items) {
          const index = FinalErList.findIndex(er => er.hpid === item.hpid?.[0]);
  
          if (index !== -1) {
            let dbErDataObject = FinalErList[index].toObject();
  
            for (const key of realTimeKeyList) {
              dbErDataObject[key] = emptyHandling(item[key]);
            }
  
            FinalErList[index] = dbErDataObject;
          }
        }
  
        // 응급실 데이터를 업데이트하고 소켓을 통해 보냅니다.
        socket.emit('updateData', FinalErList);
      });
  
    } catch (error) {
      console.log(city.city, error);
    }
  }
  
  return FinalErList;
}



// api불러오는거 오류나도 오류난 도시만 출력하고 안멈추게
async function fetchDataWithRetry(url, city, maxRetries = 3, delayBetweenRetries = 1000) {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const response = await fetch(url, { method: 'GET' });
      const xmldata = await response.text();
      
      // 성공했을 때의 처리 로직
      return xmldata;
    } catch (error) {
      // 에러를 무시하고 계속 진행
    }

    retries++;
    // 재시도 간격을 두기
    await new Promise(resolve => setTimeout(resolve, delayBetweenRetries));
  }

  // 최대 재시도 횟수를 초과한 경우 에러를 throw하거나 다른 처리를 수행할 수 있습니다.
  console.log(`${city} 에러 발생`);
}
function emptyHandling(value) {
  return value && value[0]?.trim() || null
}

