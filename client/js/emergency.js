const modal = document.getElementById('searchSelect');
const btn = document.querySelector('.input-area button');
const quickBtn = document.querySelectorAll('.quick-ul li');
const schList = document.querySelectorAll('#emergencymap .list li')
const erListBox = document.querySelector('.list-ul')

// 리스트 클릭 시 모달
const detailBack = document.getElementById('detailBack')
const infoWrap = document.querySelector('.info-wrap' )
let userLat;
let userLon;
let map



// 메인화면 세팅
function setKakaoMapMain(idName, lat, lng) {
  var mapContainer = document.getElementById(idName),
      mapOption = {
        center: new kakao.maps.LatLng(lat-0.01, lng),
        level: 6,
      };
  map = new kakao.maps.Map(mapContainer, mapOption);

  var markerPosition = new kakao.maps.LatLng(lat, lng);

  var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png'; // URL for the desired marker image
  var imageSize = new kakao.maps.Size(20, 30); // Marker image size
  var imageOption = { offset: new kakao.maps.Point(24, 35) }; // Marker image center position

  var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

  var marker = new kakao.maps.Marker({
    position: markerPosition,
    image: markerImage,
    map: map,
  });
}


function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        userLat = position.coords.latitude;
        userLon = position.coords.longitude;
        console.log('위도:', userLat);
        console.log('경도:', userLon);

         },
      error => {
        console.error('Geolocation 오류:', error);
      }
    );
  } else {
    console.error('이 브라우저에서는 Geolocation을 지원하지 않습니다.');
  }
}
getCurrentLocation();

detailBack.addEventListener('click',()=>{
  layerOut('emergencyDetail')
  bodyTag.style.overflow = 'unset'
})

//새로운 시도
const socket = io('https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app');

socket.on('connect', () => {
  console.log('서버연결성공');
  const listContainer = document.querySelector('.list-ul');
  const loadingMessageId = 'loadingMessage';
  
  // 이미 로딩 메시지가 있는지 확인
  if (!document.getElementById(loadingMessageId)) {
    const loadingMessage = document.createElement('li');
    loadingMessage.innerHTML = '<i class="xi-spinner-3  xi-spin"></i>';
    loadingMessage.style.textAlign = 'center';
    loadingMessage.id = loadingMessageId;
    loadingMessage.classList.add('name');
    listContainer.appendChild(loadingMessage);
  }
  socket.emit('getErWithRealTime', { latitude: userLat, longitude: userLon });
  setKakaoMapMain("map", userLat, userLon)
});

let previousData = []; // 이전 데이터 저장

let i = 0
let markers = {}
socket.on('updateData', (newData) => {

  if (previousData.length > 0) {
    // 맨 처음에는 전체 데이터를 사용하여 updateErList 호출
    newData = previousData.concat(newData);
    
  }
  if (i===0) {
    const loadingMessage = document.getElementById('loadingMessage');
    if (loadingMessage) {
      loadingMessage.remove();
    }
  }
  updateErList(newData);
  

  // 이전 데이터 갱신
  previousData = newData.slice();
  console.log('소켓성공');
  i++
  
});

function updateErList(data) {
  const erListBox = document.querySelector('.list-ul');

  data.forEach(er => {
    const existingLi = erListBox.querySelector(`[data-id="${er.hpid}"]`);
    
    if (existingLi) {
      // 이미 존재하는 항목인 경우 갱신
      const newLi = existingLi.cloneNode(false); // 기존 요소를 복제

      newLi.innerHTML = `
        <div class="name ellip1">${er.dutyName}</div>
        <div class="addr">${er.dutyAddr}</div>
        <div class="util">
          <span class="bed ${er.hvec !== undefined && er.hvec !== null && er.hvec > 0 ? 'on' : 'off'}">
            ${er.hvec !== undefined && er.hvec !== null
              ? (er.hvec > 0 ? '응급실 병상 있음' : '응급실 병상 없음')
              : '실시간 정보 없음'
            }
          </span>
          <a href="javascript:void(0)"><span class="call"><i class="xi-call"></i>${er.dutyTel3}</span></a>
        </div>
      `;

      newLi.addEventListener('click', () => {
        layerOn('emergencyDetail');
        setKakaoMapDetail("detailMap", er.wgs84Lat, er.wgs84Lon);
        createInfoFunc(er);
        bodyTag.style.overflow = 'hidden';
        infoWrap.scrollTop = 0;
      });
  
      existingLi.replaceWith(newLi); // 복제된 요소를 원래 요소와 교체

    } else {
      // 존재하지 않는 항목인 경우 새로 추가
      markers[er.hpid] = makeMarker(map,er.wgs84Lat,er.wgs84Lon, er.hpid)
      const li = document.createElement('li');
      li.setAttribute('data-id', er.hpid); // 각 항목에 고유한 ID를 부여하여 식별
      li.innerHTML = `
        <div class="name ellip1">${er.dutyName}</div>
        <div class="addr">${er.dutyAddr}</div>
        <div class="util">
          <span class="bed ${er.hvec !== undefined && er.hvec !== null && er.hvec > 0 ? 'on' : 'off'}">
            ${er.hvec !== undefined && er.hvec !== null
              ? (er.hvec > 0 ? '응급실 병상 있음' : '응급실 병상 없음')
              : '실시간 정보 없음'
            }
          </span>
          <a href="javascript:void(0)"><span class="call"><i class="xi-call"></i>${er.dutyTel3}</span></a>
        </div>
      `
  
      li.addEventListener('click', () => {
        layerOn('emergencyDetail');
        setKakaoMapDetail("detailMap", er.wgs84Lat, er.wgs84Lon);
        createInfoFunc(er);
        bodyTag.style.overflow = 'hidden';
        infoWrap.scrollTop = 0;
      });
  
      erListBox.appendChild(li);

    }
  });
}



function createInfoFunc(er) {
  const infoWrap = document.querySelector('.info-wrap');

  // infoWrap 내의 기존 컨텐츠를 지웁니다.
  infoWrap.innerHTML = ''
  const section1 = document.createElement('section');
  section1.innerHTML = `<div class="inner-sec" >
  <div class="name">${er.dutyName}</div>
  <div class="addr">${er.dutyAddr}</div>
  <div class="util">
      <span class="bed ${er.hvec !== undefined && er.hvec !== null && er.hvec > 0 ? 'on' : 'off'}">${er.hvec !== undefined && er.hvec !== null
        ? (er.hvec > 0 ? '응급실 병상 있음' : '응급실 병상 없음')
        : '실시간 정보 없음'
      }</span>
      <a href="tel:${er.dutyTel3}"><span class="call"><i class="xi-call"></i>${er.dutyTel3}</span></a>
  </div>
  <div class="sec-tit">진료시간</div>
  <div class="time-wrap">
      <ul class="left">
          <li>월요일 <span class="time">${er.dutyTime1Mon ==='-'?'휴무': er.dutyTime1Mon}</span></li>
          <li>화요일 <span class="time">${er.dutyTime2Tue ==='-'?'휴무': er.dutyTime2Tue}</span></li>
          <li>수요일 <span class="time">${er.dutyTime3Wed ==='-'?'휴무': er.dutyTime3Wed}</span></li>
          <li>목요일 <span class="time">${er.dutyTime4Thu ==='-'?'휴무': er.dutyTime4Thu}</span></li>
      </ul>
      <ul class="right">
          <li>금요일 <span class="time">${er.dutyTime5Fri ==='-'?'휴무': er.dutyTime5Fri}</span></li>
          <li>토요일 <span class="time">${er.dutyTime6Sat ==='-'?'휴무': er.dutyTime6Sat}</span></li>
          <li class="txt-point">일요일 <span class="time txt-point">${er.dutyTime7Sun ==='-'?'휴무': er.dutyTime7Sun}</span></li>
          <li class="txt-point">공휴일 <span class="time txt-point">${er.dutyTime8Hol ==='-'?'휴무': er.dutyTime8Hol}</span></li>
      </ul>
  </div>
  <p class="time-info txt-point">* 운영시간은 변동될 수 있으니 방문 전 확인 후 이용 부탁드립니다.</p>
</div>`
infoWrap.appendChild(section1)

//진료과목넣기
const section2 = document.createElement('section')
section2.classList.add('basic-sec')
const erDgidIdNameList = er.dgidIdName.split(',');

section2.innerHTML = `
  <div class="inner-sec">
    <div class="sec-tit">진료과목</div>
    <ul>
      ${erDgidIdNameList.map(item => `<li>${item}</li>`).join('')}
    </ul>
  </div>
`
infoWrap.appendChild(section2)



// 특수진료과목
if(er.specialErList !== undefined){
  const section = document.createElement('section')
  section.classList.add('basic-sec')
  section.classList.add('bo')
  const specialErList = er.specialErList.split(',');
  section.innerHTML = `
    <div class="inner-sec">
      <div class="sec-tit">특수진료 정보</div>
      <ul>
        ${specialErList.map(item => `<li>${item}</li>`).join('')}
      </ul>
    </div>
  `
  infoWrap.appendChild(section)
}

// 실시간 응급실
if(er.isRealTimeEmergencyData === true && er.hvec !== undefined){
  const realTimeNameDic = {
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
}
  const realTimeKeyList = [ 'hvec', 'hvoc', 'hvcc', 'hvncc', 'hvccc','hvicc', 'hvgc', 'hvdnm', 'hvctayn', 'hvmriayn','hvangioayn', 'hvventiayn', 'hvventisoayn', 'hvincuayn', 'hvcrrtayn','hvecmoayn', 'hvoxyayn', 'hvhypoayn', 'hvamyn', 'hv1','hv2', 'hv3', 'hv4', 'hv5','hv6', 'hv7', 'hv8', 'hv9', 'hv10','hv11', 'hv12', 'hv13', 'hv14', 'hv15','hv16', 'hv17', 'hv18', 'hv19', 'hv21','hv22', 'hv23', 'hv24', 'hv25', 'hv26','hv27', 'hv28', 'hv29', 'hv30', 'hv31','hv32', 'hv33', 'hv34', 'hv35', 'hv36','hv37', 'hv38', 'hv39', 'hv40', 'hv41','hv42', 'hv43', 'HVS01', 'HVS02', 'HVS03','HVS04', 'HVS05', 'HVS06', 'HVS07', 'HVS08','HVS09', 'HVS10', 'HVS11', 'HVS12', 'HVS13','HVS14', 'HVS15', 'HVS16', 'HVS17', 'HVS18','HVS19', 'HVS20', 'HVS21', 'HVS22', 'HVS23','HVS24', 'HVS25', 'HVS26', 'HVS27', 'HVS28','HVS29', 'HVS30', 'HVS31', 'HVS32', 'HVS33','HVS34', 'HVS35', 'HVS36', 'HVS37', 'HVS38','HVS46', 'HVS47', 'HVS48', 'HVS49', 'HVS50','HVS51', 'HVS52', 'HVS53', 'HVS54', 'HVS55','HVS56', 'HVS57', 'HVS58', 'HVS59']
  const section = document.createElement('section')
  section.classList.add('basic-sec')
  section.classList.add('bo')
  section.innerHTML = `
  <div class="inner-sec">
    <div class="sec-tit">실시간 응급실 상황</div>
    <ul>
      ${realTimeKeyList.map(item => {
        const name = realTimeNameDic[item].replace(/\(가\/부\)/g, ''); // Remove (가/부) text
        const value = er[item];
        
        if (value !== null) {
          if (value === 'Y') {
            return `<li>${name} : 가능</li>`;
          } else if (value === 'N' || value === 'N1') {
            return `<li class="gray-font">${name} : 불가능</li>`;
          } else if(value <= 0){
            return `<li class="gray-font">${name} : ${value}</li>`;
          } else{
            return `<li>${name} : ${value}</li>`;
          }
        } else {
           ''; // Don't display anything for null values
        }
      }).join('')}
    </ul>
  </div>
`
  infoWrap.appendChild(section)
  const grayLi = document.querySelectorAll('.gray-font')
  grayLi.forEach((li) => {
    // 개별 요소에 대해 color 스타일을 'lightgray'로 설정합니다.
    li.style.color = 'lightgray';
  });
}

// 의료자원 넣기
const section3 = document.createElement('section')
section3.classList.add('basic-sec')
section3.classList.add('bo')
const equipmentList = er.equipmentList.split(',');
section3.innerHTML = `
  <div class="inner-sec">
    <div class="sec-tit">의료장비</div>
    <ul>
      ${equipmentList.map(item => `<li>${item}</li>`).join('')}
    </ul>
  </div>
  <br><br><br><br><br><br><br><br><br><br><br>
`
infoWrap.appendChild(section3)

infoWrap.innerHTML += `
<a href="tel:${er.dutyTel3}">
  <button type="button" class="point-btn call-btn">전화하기</button>
</a>
`
    
//createInfoFunc 끝
}


function setKakaoMapDetail(idName, lat, lng) {
  var mapContainer = document.getElementById(idName),
      mapOption = {
        center: new kakao.maps.LatLng(lat, lng),
        level: 3,
      };
  var map = new kakao.maps.Map(mapContainer, mapOption);
  var markerPosition = new kakao.maps.LatLng(lat, lng);
    
  var imageSrc = '../../img/marker/marker2.png',
  imageSize = new kakao.maps.Size(48, 52),
  imageOption = {offset: new kakao.maps.Point(20, 52)};
  var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

  var marker = new kakao.maps.Marker({
    position: markerPosition,
    image: markerImage
  });

  marker.setMap(map);
}

// 모든 마커 정보를 저장하는 배열
let selectedMarker = null;

function makeMarker(map, lat, lng, hpid) {
  var markerPosition = new kakao.maps.LatLng(lat, lng);

  var imageSrc = '../../img/marker/marker2.png',
      imageSize = new kakao.maps.Size(48, 52),
      imageOption = { offset: new kakao.maps.Point(20, 52) };

  var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

  var marker = new kakao.maps.Marker({
      position: markerPosition,
      image: markerImage
  });

  marker.setMap(map);

  kakao.maps.event.addListener(marker, 'click', function () {

      // 클릭한 마커의 위치로 지도 중심 이동
      map.setCenter(new kakao.maps.LatLng(lat - 0.01, lng));

      // 해당 마커에 대응하는 리스트 아이템을 찾아서 스크롤
      const targetLi = erListBox.querySelector(`[data-id="${hpid}"]`);
      if (targetLi) {
          targetLi.scrollIntoView({ behavior: 'smooth', block: 'start' });

          $(targetLi).addClass('on')
          $('.list-ul li').not(targetLi).removeClass('on')
      }
  });

  return marker;  // 생성한 마커를 반환
}


function makeHomeMarker(map, lat, lng) {
  var markerPosition = new kakao.maps.LatLng(lat, lng);

  var markerImage = new kakao.maps.MarkerImage(
    '../../img/marker/marker2.png', // 흰색 아이콘 이미지의 URL로 교체
    new kakao.maps.Size(48, 52),
    { offset: new kakao.maps.Point(20, 52) }
  );
  
  var marker = new kakao.maps.Marker({
    position: markerPosition,
    image: markerImage,
    fillColor: '#FFFF00', // 마커의 배경색을 노란색으로 지정
  });
  
  marker.setMap(map);
}

const locationBtn = document.querySelector('.location-btn');
// 현재위치로 이동
locationBtn.addEventListener('click', () => {
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      const { latitude: userLat, longitude: userLon } = coords;
      map.setLevel(6);
      map.panTo(new kakao.maps.LatLng(userLat - 0.01, userLon));
      
    },
    (error) => {
      console.error('Geolocation 오류:', error);
    }
  );
});