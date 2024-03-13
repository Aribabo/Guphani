const modal = document.getElementById('searchSelect');
const schList = document.querySelectorAll('#pharmacymap .list li')
const loadingMessage = document.querySelector('.loadingMessage')
const bodyTag1 = document.querySelector('body')
const detailBack = document.getElementById('detailBack')
const infoWrap = document.querySelector('.info-wrap' )
// 퀵버튼
const quickBtns = document.querySelectorAll('.quick-ul li');
const everyBtn = document.querySelector('.every');

let latitude
let longitude
let map

function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        console.log('위도:', latitude);
        console.log('경도:', longitude);

        // 지도 중심을 현재 위치로 이동
        // map.setCenter(new kakao.maps.LatLng(userLat, userLon));
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


$('.quick-ul li').on('click',()=>{
  $(this).addClass('on')
  $('.quick-ul li').not(this).removeClass('on')
})

quickBtns.forEach((el) => {
  el.addEventListener('click', () => {

    // 현재 클릭된 버튼의 상태를 토글 (추가 또는 제거)
    el.classList.toggle('on');

    // 각 버튼에 따라 마커 및 리스트 항목을 보이거나 감추는 로직 추가
    const allListItems = document.querySelectorAll('.list-ul li');
    allListItems.forEach((listItem) => {
      const isOperating = listItem.querySelector('.bed').classList.contains('on');
      const isHoliday = listItem.querySelector('.name').classList.contains('holi');

      switch (el.classList[0]) {
        case 'now':
          // '운영중' 버튼 클릭 시
          listItem.style.display = isOperating ? 'list-item' : 'none';
          break;
        case 'holiday':
          // '공휴일' 버튼 클릭 시
          listItem.style.display = isHoliday ? 'list-item' : 'none';
          break;
        case 'every':
          // '전체' 버튼 클릭 시
          listItem.style.display = 'list-item';
          break;
        default:
          break;
      }
    });

    // 여기서는 마커를 표시/감추는 로직을 추가해야 합니다.
    // (마커 객체에 대한 정보가 어떻게 구성되어 있는지에 따라 구현 방법이 다를 수 있습니다.)
    // markers 객체를 이용하여 마커를 제어
    for (const hpid in markers) {
      const marker = markers[hpid];
      const pharmacy = pharmacyList.find((pharmacy) => pharmacy.hpid === hpid);

      // 마커를 표시/감추는 로직 추가
      if (marker && pharmacy) {
        const isOperating = pharmacy.openNow;
        const isHoliday = pharmacy.dutyTime8Hol !== '-';

        switch (el.classList[0]) {
          case 'now':
            // '운영중' 버튼 클릭 시
            marker.setMap(isOperating ? map : null);
            break;
          case 'holiday':
            // '공휴일' 버튼 클릭 시
            marker.setMap(isHoliday ? map : null);
            break;
          case 'every':
            // '전체' 버튼 클릭 시
            marker.setMap(map);
            break;
          default:
            break;
        }
      }
    }
  });
});

detailBack.addEventListener('click',()=>{
  layerOut('pharmacyDetail')
  bodyTag1.style.overflow = 'unset'
})

const socket = io('https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app');

socket.on('connect', () => {
  console.log('서버연결성공');
   
  socket.emit('getNearPharmacy', { latitude: latitude, longitude: longitude });
  setKakaoMap("map", latitude, longitude);
});
let pharmacyList
i = 0
socket.on('updatePharmacy', (newData) => {
  if(i === 2){
    everyBtn.click();
  }
  pharmacyList = newData
  console.log(newData);
  i++
  makeLiElement(newData)
})

let markers = {};
let selectedMarker = null;

function makeMarker(map, lat, lng, hpid) {
  var markerPosition = new kakao.maps.LatLng(lat, lng);
  
  var imageSrc = '../../img/marker/marker1.png',
      imageSize = new kakao.maps.Size(48, 52),
      imageOption = { offset: new kakao.maps.Point(20, 52) };
  
  var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

  var marker = new kakao.maps.Marker({
    position: markerPosition,
    image: markerImage
  });

  marker.setMap(map);

  kakao.maps.event.addListener(marker, 'click', function () {
    // 이전에 클릭된 마커의 상태 초기화
    if (selectedMarker) {
      selectedMarker.li.style.backgroundColor = 'white';
    }

    // 클릭한 마커의 위치로 지도 중심 이동
    map.setCenter(new kakao.maps.LatLng(lat - 0.003, lng));
  
    // 클릭된 마커에 대응하는 리스트 아이템을 찾아서 스크롤
    const clickedLiId = hpid;
    const clickedLi = document.getElementById(clickedLiId);
    if (clickedLi) {
      clickedLi.scrollIntoView({ behavior: 'smooth', block: 'start' });
  
      // 회색 배경 적용
      clickedLi.style.backgroundColor = '#F5F5F5';
  
      // 현재 클릭된 마커 저장
      selectedMarker = { marker, li: clickedLi };
    }
  });

  return marker;  // 생성한 마커를 반환
}

schList.forEach((el)=>{
  el.addEventListener('click',()=>{
    layerOn('pharmacyDetail')
    bodyTag1.style.overflow = 'hidden'
    infoWrap.scrollTop = 0;
    setKakaoMap("detailMap", 37.319846, 127.068577);
  })
})

detailBack.addEventListener('click',()=>{
  layerOut('pharmacyDetail')
  bodyTag1.style.overflow = 'unset'
})


function setKakaoMap(idName, lat, lng) {
  var mapContainer = document.getElementById(idName),
      mapOption = {
        center: new kakao.maps.LatLng(lat-0.0030, lng),
        level: 4,
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


function makeLiElement(list) {
  const ulElement = document.querySelector('.list-ul');
  // 새로운 리스트의 아이템들이 기존의 리스트에 없으면 추가
  list.forEach((pharmacy, index) => {
    let liElement = document.getElementById(pharmacy.hpid);
    if (!liElement) {
      liElement = document.createElement('li');
      liElement.id = pharmacy.hpid;  // hpid를 아이디로 설정
      ulElement.appendChild(liElement);

      // 마커 생성
      markers[pharmacy.hpid] = makeMarker(map, pharmacy.wgs84Lat, pharmacy.wgs84Lon, pharmacy.hpid);
    }


    liElement.innerHTML = `
      <div class="name ellip1 ${pharmacy.dutyTime8Hol === '-'? '' : 'holi'}">${pharmacy.dutyName}</div>
      <div class="addr">${pharmacy.dutyAddr}</div>
      <div class="util">
        <span class="bed ${pharmacy.openNow ? 'on' : 'off'}">${pharmacy.openNow ? '영업중' : '영업종료'}</span>
        <span class="call"><i class="xi-call"></i>${pharmacy.dutyTel1}</span>
        ${pharmacy.dutyTime8Hol !== '-' ? `<span class="holiBox">공휴일</span>` : ''}
      </div>
    `;
    liElement.addEventListener('click', () => {
      layerOn('pharmacyDetail');
      setKakaoMapDetail("detailMap", pharmacy.wgs84Lat, pharmacy.wgs84Lon);
      createInfoFunc(pharmacy);
      bodyTag1.style.overflow = 'hidden';
      infoWrap.scrollTop = 0;
    });

    // 순서가 바뀌었다면 위치를 조정
    if (ulElement.children[index] !== liElement) {
      ulElement.insertBefore(liElement, ulElement.children[index]);
    }
  });

  // 기존의 리스트에 있던 아이템이 새로운 리스트에 없으면 삭제
  Array.from(ulElement.children).forEach(child => {
    if (!list.some(pharmacy => pharmacy.hpid === child.id)) {
      ulElement.removeChild(child);
  
      // 마커 제거
      if (markers[child.id]) {
        markers[child.id].setMap(null);
        delete markers[child.id];
      }
    }
  });
}


function setKakaoMapDetail(idName, lat, lng) {
  var mapContainer = document.getElementById(idName),
      mapOption = {
        center: new kakao.maps.LatLng(lat, lng),
        level: 3,
      };
  var map = new kakao.maps.Map(mapContainer, mapOption);
  var markerPosition = new kakao.maps.LatLng(lat, lng);
    
  // 마커 이미지 설정
  var imageSrc = '../../img/marker/marker1.png',
  imageSize = new kakao.maps.Size(48, 52),
  imageOption = {offset: new kakao.maps.Point(20, 52)};
  var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

  var marker = new kakao.maps.Marker({
    position: markerPosition,
    image: markerImage // 마커 이미지 설정
  });

  marker.setMap(map);
}





function createInfoFunc(er) {
  const infoWrap = document.querySelector('.info-wrap');

  // infoWrap 내의 기존 컨텐츠를 지웁니다.
  infoWrap.innerHTML = ''
  const section = document.createElement('section');
  section.innerHTML = `<div class="inner-sec" >
  <div class="name">${er.dutyName}</div>
  <div class="addr">${er.dutyAddr}</div>
  <div class="util">
      <span class="bed ${er.openNow ? 'on' : 'off'}">${er.openNow ? '영업중' : '영업종료'}</span>
      <a href="tel:${er.dutyTel1}"><span class="call"><i class="xi-call"></i>${er.dutyTel1}</span></a>
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
</div>
`
infoWrap.appendChild(section)

infoWrap.innerHTML += `
<a href="tel:${er.dutyTel1}">
  <button type="button" class="point-btn call-btn">전화하기</button>
</a>
`
//createInfoFunc 끝
}


const locationBtn = document.querySelector('.location-btn');
// 현재위치로 이동
locationBtn.addEventListener('click', () => {
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      const { latitude: latitude, longitude: longitude } = coords;
      map.setLevel(4);
      map.panTo(new kakao.maps.LatLng(latitude - 0.0030, longitude));
    },
    (error) => {
      console.error('Geolocation 오류:', error);
    }
  );
});