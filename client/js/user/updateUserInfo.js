const userId = localStorage.getItem('userId');
const userIdInput = document.getElementById('userid');
const changeAndNextBtn = document.getElementById('changeAndNextBtn');
const hpBtn = document.getElementById('hpBtn');
const hpCheck = document.getElementById('hpCheck');
const hpCheckBtn = document.getElementById('hpCheckBtn');
const changeBtn = document.getElementById('submitForm');

let [nameBool, birthBool, hpBool] = [false, false, false];

// 팝업생성
function makePopup(popupMessage) {
    const message = document.getElementById('message');
    message.innerText = popupMessage;

    // 팝업창 열기
    layerOn('updateUserInfoLayer');
}

// 수정사항 저장용 버튼
function makePopup2(popupMessage) {
    const message = document.getElementById('message1');
    message.innerText = popupMessage;

    // 팝업창 열기
    layerOn('goUpdateUserInfo2Layer');
}

// 수정 사항 저장 후 추가 정보 수정 페이지로 이동
changeAndNextBtn.addEventListener('click', () => {
    window.location.href = 'updateUserInfo2.html';
});

if (userIdInput) {
    userIdInput.value = userId;
}

const token = localStorage.getItem('token');

const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
};

let realOriginName;
let realOriginBirthdate;
let realOriginGender;
let realOriginPhoneNumber;

fetch(`https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/auth/user/detail/${userId}`, {
    method: 'GET',
    headers: headers,
})
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(user => {
        console.log('User Data:', user);

        const name = user.user.name;
        const birthdate = user.user.birthdate;
        const gender = user.user.gender;
        const phoneNumber = user.user.phoneNumber;

        realOriginName = user.user.name;
        realOriginBirthdate = user.user.birthdate;
        realOriginGender = user.user.gender;
        realOriginPhoneNumber = user.user.phoneNumber;

        console.log('Name:', name);
        console.log('Birthdate:', birthdate);
        console.log('Gender:', gender);
        console.log('Phone Number:', phoneNumber);

        const originName = document.getElementById('name');
        const originBirth = document.getElementById('birthdate');
        const originHp = document.getElementById('phoneNumber');
        const originGender = document.getElementById('gender');
        const IsMale = document.getElementById('m');
        const IsFemale = document.getElementById('f');
        const genderRadio = document.getElementsByName('gender')


        if (originName) originName.textContent = name;
        if (originBirth) originBirth.textContent = birthdate;
        if (originHp) originHp.textContent = phoneNumber;
        if (originGender) originGender.textContent = gender;

        document.querySelector('.hiddenBirth').style.visibility = 'hidden';

        // 회원가입할 때 입력한 기본 값을 텍스트 박스 안에 디폴트로 넣어줌
        if (originName) {
            originName.value = name;
        }
        if (originBirth) {
            originBirth.value = birthdate;
        }
        if (originHp) {
            originHp.value = phoneNumber;
        }
        genderRadio.forEach((el)=>{
            if(el.value == gender){
                el.checked = true
            }
        })

        // 이름 받아오기 -> 다음 눌렀을때만 검증해서 팝업에 안내문구 뜨게
        const nameInput = document.getElementById('name');

        nameInput.addEventListener('input', () => {
            const name = nameInput.value.trim();

            // 추가된 조건: 한국어일 경우 한글만, 영어일 경우 영어만 허용
            const isKorean = /^[가-힣]+$/.test(name);
            const isEnglish = /^[a-zA-Z]+$/.test(name);

            // 조건을 만족하면서 추가된 조건도 충족하면 nameBool을 true로, 그렇지 않으면 false로 설정
            nameBool = (isKorean && !isEnglish) || (!isKorean && isEnglish);
        });
    })
    .catch(error => {
        console.error('유저 정보를 가져오는 도중 오류가 발생했습니다:', error.message);
        // 유저 정보를 가져오는 도중 오류가 발생하면 해당 오류 메시지를 콘솔에 출력
    });

document.addEventListener('DOMContentLoaded', function () {
    // Your code here

    // 휴대폰 번호 인증
    const hpCheck = document.getElementById('hpCheck');
    const hpCheckNumber = document.getElementById('hpCheckNumber');

    if (hpCheck) {
        hpCheck.addEventListener('click', async function (event) {
            event.preventDefault();
            const hp = document.getElementById('phoneNumber').value.replace(/[^0-9]/g, '');
            if(hp === realOriginPhoneNumber ){
                return makePopup('이미 사용하고 계신 번호입니다.')
            }
            if (hp.length < 10 || hp.length > 11) {
                makePopup('번호를 확인해주세요');
            } else {
                const phnumber = document.getElementById('phoneNumber').value;

                try {
                    // phnumber로 인증번호 전송
                    const response = await fetch('https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/auth/user/sendVerification', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ phnumber: phnumber })
                    });

                    if (response.status === 200) {
                        document.querySelector('.hp-check').style.display = 'flex';
                        document.getElementById('phoneNumber').disabled = 'true';
                        makePopup('인증번호 전송 되었습니다. 최대 5분 정도 걸릴 수 있습니다..');
                    } else {
                        makePopup('인증번호 전송에 실패했습니다.');
                    }
                } catch (error) {
                    console.error('휴대폰 번호 인증번호 전송 도중 오류가 발생했습니다:', error.message);
                    // 휴대폰 번호 인증번호 전송 도중 오류가 발생하면 해당 오류 메시지를 콘솔에 출력
                    makePopup('인증번호 전송에 실패했습니다.');
                }

                hpCheckNumber.addEventListener('click', async function (event) {
                    event.preventDefault();
                    const phnumber = `${document.getElementById('phoneNumber').value}`;
                    const inputVerificationCode = `${document.getElementById('verficateCode').value}`;

                    try {
                        const response = await fetch('https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/auth/user/verifyCode', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                phnumber,
                                verificationCode: inputVerificationCode
                            })
                        });

                        if (response.status === 200) {
                            // 인증이 성공하면 인증받기 -> 인증완료로 바뀌고 버튼 기능 사라짐
                            hpCheck.textContent = '인증완료';
                            hpCheck.disabled = true;
                            hpBool = true;

                            // 인증이 성공하면 인증번호 입력칸, 인증버튼 숨김
                            document.getElementById('verification').style.display = 'none';
                            makePopup('인증 성공');

                        } else {
                            makePopup('인증 실패');
                        }
                    } catch (error) {
                        console.error('휴대폰 번호 인증 도중 오류가 발생했습니다:', error.message);
                        // 휴대폰 번호 인증 도중 오류가 발생하면 해당 오류 메시지를 콘솔에 출력
                        makePopup('인증 실패');
                        location.reload();
                    }
                });
            }
        });
    }

    document.getElementById('birthdate').addEventListener('input', () => {
        const birthday = document.getElementById('birthdate').value.trim();
        const birthPattern = /^[0-9]{8}$/;
        let isValidBirth = birthPattern.test(birthday);
        if (isValidBirth) {
            if (birthday <= 19000000 || birthday >= 20500000) {
                isValidBirth = false;
                birthBool = false;
                document.querySelector('.hiddenBirth').style.visibility = 'visible';
            } else {
                document.querySelector('.hiddenBirth').style.visibility = 'hidden';
            }
        } else {
            document.querySelector('.hiddenBirth').style.visibility = 'visible';
        }
    });
});

    


document.addEventListener('DOMContentLoaded', function () {
    
    async function handleServerClientConnection() {
        const userName = document.getElementById('name').value;
        const userGender = document.querySelector('input[name="gender"]:checked').value;
        const userBirthdate = document.getElementById('birthdate').value;
        const userPhoneNumber = document.getElementById('phoneNumber').value;

        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/auth/user/updateMain`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id: userId,
                    name: userName,
                    gender: userGender,
                    birthdate: userBirthdate,
                    phoneNumber: userPhoneNumber
                }),
            });

            if (response.ok) {
                const data = await response.json();
                // console.log('Server Response:', data);
                makePopup('업데이트 되었습니다');
                location.reload()
            } else {
                const errorMessage = await response.text();
                console.error('Server Error:', errorMessage);
                makePopup('서버 오류로 업데이트에 실패했습니다.');
            }
        } catch (error) {
            console.error('서버와의 연결 도중 오류가 발생했습니다:', error.message);
            makePopup('서버와의 연결 도중 오류가 발생했습니다.');
        }
    }

    // 수정사항 저장
    changeBtn.addEventListener('click', () => {
        const newName = document.getElementById('name').value.trim();
        const newBirth = document.getElementById('birthdate').value.trim();
        const newHp = document.getElementById('phoneNumber').value.trim();
        const newGender = document.querySelector('input[name="gender"]:checked').value;
        let result;

        if (realOriginName === newName && realOriginBirthdate === newBirth && realOriginGender === newGender && realOriginPhoneNumber === newHp) {
            result = false;
            return makePopup2('변경사항이 없습니다');
        } else if (!nameBool && realOriginName !== newName) {
            result = false;
            return makePopup2('이름이 양식에 맞지 않습니다');
        } else if (realOriginBirthdate !== newBirth) {
            if ((newBirth <= 19000000 || newBirth >= 20500000)) {
                return makePopup2('생년월일이 양식에 맞지 않습니다');
            } else {
                result = true;
            }
        } else if (!hpBool && realOriginPhoneNumber !== newHp) {
            result = false;
            return makePopup2('전화번호 인증을 해주세요');
        } else {
            result = true;
        }

        if (result) {
            handleServerClientConnection();
        }
    });
});