async function getClosestAmbulances() {
  try {
    // 사용자의 위경도를 자동 저장
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const userLatitude = position.coords.latitude; // 사용자의 위도
          const userLongitude = position.coords.longitude; // 사용자의 경도
          console.log(`사용자의 위치 - 위도: ${userLatitude}, 경도: ${userLongitude}`);
          // 사용자 위경도를 이용해서 거리 순 구급차 리스트 정렬
          const ambulanceData = await fetch('https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/ambulance/getRealTime', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userLatitude,
              userLongitude,
            }),
          });

          if (!ambulanceData.ok) {
            console.error('Failed to fetch emergency data:', ambulanceData.status, ambulanceData.statusText);
            return;
          }

          const result = await ambulanceData.json();
          console.log('Emergency data received from server:', result);

          // 데이터를 HTML에 추가
          // HTML에 접근할 때 <ul class="list-ul"></ul> 과 같은 요소가 존재해야 함
          const list = document.querySelector('.list-ul');
          list.innerHTML = ''; // 기존 리스트 초기화

          result.forEach((ambulance) => {
            if (ambulance.onrTel) {
              // const distance = ambulance.distance ? ambulance.distance.toFixed(2) : '정보 없음'; 혹시나 쓸 일이 있을까 싶어 주석으로 남겨뒀습니다.
              const name = ambulance.dutyName ? ambulance.dutyName : '정보 없음'; // 이름이 null이면 '정보 없음'을 사용
              const addr = ambulance.dutyAddr ? ambulance.dutyAddr : '정보 없음'; // 주소가 null이면 '정보 없음'을 사용
              const tel = ambulance.onrTel ? ambulance.onrTel : '정보 없음'; // 전화번호가 null이면 '정보 없음'을 사용
              const carSeq = ambulance.carSeq ? ambulance.carSeq : '정보 없음'; // 차량번호가 null이면 '정보 없음'을 사용
              const li = document.createElement('li');
              li.innerHTML =
                ` <div class="name ellip1">${name}</div>
                <div class="addr">${addr}</div>
                <div class="util">
                <button type="button" class="call-button"><i class="xi-call"></i>${tel}</button>
                <span>차량번호: ${carSeq}</span>
              `;
              list.appendChild(li);
              const callButton = li.querySelector('.call-button');

              callButton.addEventListener('click', () => {
                const telLink = `tel:${tel}`;
                window.location.href = telLink;
              });
            }

          });
        },
        (error) => {
          console.error('위치 정보를 가져오는 중 에러 발생:', error);
        }
      );
    } else {
      console.log('Geolocation API를 지원하지 않습니다.');
    }
  } catch (error) {
    console.error('Error in getClosestAmbulances function:', error);
  }
}

// 페이지 로드 시 getClosestAmbulances 함수 호출
window.onload = getClosestAmbulances;