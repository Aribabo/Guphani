const findIdBtn = document.getElementById('findIdBtn');
const pwCheck = document.getElementById('newPw');
const pwDoubleCheck = document.getElementById('newPwCheck');

// popup 발생 이벤트
function makePopup(popupMessage) {
    const message = document.getElementById('message');
    message.innerText = popupMessage;

    // 팝업창 열기
    layerOn('register2Layer');
}


function maskUserId(userId) {
    const maskLength = Math.floor(userId.length / 3) + 1;
    const startIndex = Math.ceil((userId.length - maskLength) / 2);

    const maskedUserId =
        userId.substring(0, startIndex) +
        '*'.repeat(maskLength) +
        userId.substring(startIndex + maskLength);

    return maskedUserId;
}

// 아이디 찾기
findIdBtn.addEventListener('click', async () => {
    const inputName = document.getElementById('username').value.trim();
    const inputHp = document.getElementById('findid-userhp').value.replace(/[^0-9]/g, '');

    if (inputName === '' || inputHp === '') {
        makePopup('이름과 전화번호를 모두 입력해주세요');
    } else {
        try {
            const response = await fetch('https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/auth/searchId', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: inputName,
                    phoneNumber: inputHp,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                if (result) {
                    console.log(result.foundUser);
                    let html = ''
                    cnt = 0
                    result.foundUser.forEach((el)=>{
                        if (el.isUser === 'Y') {
                            console.log('dd');
                            html += `<p>아이디는 <strong class="txt-point">${maskUserId(el.id)} </strong>입니다.</p>`
                        }else{
                            cnt += 1
                        }                        
                    })
                    if (html === '' && cnt > 0) {
                        makePopup(`탈퇴한 회원입니다`);
                        document.getElementById('username').value = '';
                        document.getElementById('findid-userhp').value = '';
                    }else if(html === ''){
                        console.log(html);
                        makePopup(`일치하는 사용자가 없습니다`);
                        document.getElementById('username').value = '';
                        document.getElementById('findid-userhp').value = '';
                    }else{
                    const message = document.getElementById('message');
                    message.innerHTML = html;     
                    // 팝업창 열기
                    layerOn('register2Layer');                   
                    }
                    
                }else{
                    makePopup(`일치하는 사용자가 없습니다`);
                    document.getElementById('username').value = '';
                    document.getElementById('findid-userhp').value = '';
                }


                if (result.isUser == 'N') {
                    makePopup(`탈퇴한 회원입니다`);
                    document.getElementById('username').value = '';
                    document.getElementById('findid-userhp').value = '';
                } else if (result.id) {
                    const maskedUserId = maskUserId(result.id);
                    makePopup(`아이디는 ${maskedUserId}입니다`);
                } 



            } else {
                makePopup('일치하는 사용자가 없습니다');
            }
        } catch (error) {
            console.error('Error:', error);
            makePopup('일치하는 사용자가 없습니다');
        }
    }
});

// 비밀번호 양식 검증
pwCheck.addEventListener('input', () => {
    const userpwInput = document.getElementById('newPw').value.trim();
    const userpwInputAgain = document.getElementById('newPwCheck').value.trim();

    // 정규표현식을 사용하여 비밀번호 검증
    const pwPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d$@$!%*#?&]{6,20}$/;
    const isValidPw = pwPattern.test(userpwInput);

    // 팝업창에 표시될 메시지
    if (!isValidPw) {
        document.getElementById('pw_info').style.display = 'block';
    } else {
        document.getElementById('pw_info').style.display = 'none';
    }
    if (userpwInput !== userpwInputAgain) {
        document.getElementById('pwCheck_info').style.display = 'block';
        document.getElementById('resetPwBtn').style.marginBottom = '0';
    } else {
        document.getElementById('pwCheck_info').style.display = 'none';
    }
    if (userpwInputAgain === '') {
        document.getElementById('pwCheck_info').style.display = 'none';
    }
});

// 비밀번호 확인 검증
pwDoubleCheck.addEventListener('input', () => {
    const userpwInput = document.getElementById('newPw').value.trim();
    const userpwInputAgain = document.getElementById('newPwCheck').value.trim();

    // 팝업창에 표시될 메시지
    if (userpwInput !== userpwInputAgain) {
        document.getElementById('pwCheck_info').style.display = 'block';
        document.getElementById('resetPwBtn').style.marginBottom = '0';
    } else {
        document.getElementById('pwCheck_info').style.display = 'none';
    }
    if (userpwInputAgain === '') {
        document.getElementById('pwCheck_info').style.display = 'none';
    }
});

//비밀번호 찾기
document.getElementById('findpw-onestepBtn').addEventListener('click', async function () {
    // 입력된 아이디와 전화번호 가져오기
    const inputId = document.getElementById('userid').value.trim();
    const inputHp = document.getElementById('findpw-onetwostep').value.replace(/[^0-9]/g, '');
    if (inputId === '' || inputHp === '') {
        makePopup('이름과 전화번호를 모두 입력해주세요');
    } else {
        try {
            const response = await fetch('https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/auth/searchPW', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: inputId,
                    phoneNumber: inputHp,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                if (result) {
                    const inputHp = document.getElementById('findpw-onetwostep').value.replace(/[^0-9]/g, '');
                    
                    
                    if(result.user.isUser =='N'){
                        makePopup(`탈퇴한 회원입니다`);
                        document.getElementById('findpw-onetwostep').value = ''
                        document.getElementById('userid').value=''

                    }else{
                        document.getElementById('findpw-onetwostep').disabled = true;
                        Array.from(document.getElementsByClassName('findpw-onestep')).forEach(function (element) {
                            element.style.display = 'none';
                        });
                        Array.from(document.getElementsByClassName('findpw-twostep')).forEach(function (element) {
                            element.style.display = 'block';
                        });

                        try {
                            // inputHp로 인증번호 전송
                            const response = await fetch('https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/auth/user/sendVerification', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ phnumber: inputHp }),
                            });
                            if (response.status == 200) {
                                makePopup('인증번호 전송 되었습니다. 최대 5분 정도 걸릴 수 있습니다.');
                            } else {
                                makePopup('인증번호 전송에 실패했습니다.');
                            }
                        } catch (error) {
                            makePopup('인증번호 전송에 실패했습니다. 새로고침 후에 다시 시도해주세요');
                        }

                        document.getElementById('findpw-twostepBtn').addEventListener('click', async function (event) {
                            event.preventDefault();
                            const phnumber = inputHp;
                            const inputVerificationCode = `${document.getElementById('findpw-twostep').value.trim()}`;

                            try {
                                const response = await fetch('https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/auth/user/verifyCode', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        phnumber,
                                        verificationCode: inputVerificationCode,
                                    }),
                                });

                                if (response.status === 200) {
                                    Array.from(document.getElementsByClassName('findpw-onetwostep')).forEach(function (element) {
                                        element.style.display = 'none';
                                    });
                                    Array.from(document.getElementsByClassName('findpw-twostep')).forEach(function (element) {
                                        element.style.display = 'none';
                                    });
                                    Array.from(document.getElementsByClassName('findpw-threestep')).forEach(function (element) {
                                        element.style.display = 'block';
                                    });

                                    makePopup('인증 성공');

                                    document.getElementById('resetPwBtn').addEventListener('click', async () => {
                                        const userpwInput = document.getElementById('newPw').value.trim();
                                        const userpwInputAgain = document.getElementById('newPwCheck').value.trim();
                                        const pwPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d$@$!%*#?&]{6,20}$/;
                                        const isValidPw = pwPattern.test(userpwInput);

                                        if (!isValidPw) {
                                            makePopup('비밀번호 양식을 확인해주세요');
                                        } else if (userpwInput !== userpwInputAgain) {
                                            makePopup('비밀번호가 일치하지 않습니다');
                                        } else {
                                            try {
                                                const response = await fetch('https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/auth/updatePassword', {
                                                    method: 'PUT',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify({
                                                        id: inputId,
                                                        phoneNumber: inputHp,
                                                        newPassword: userpwInputAgain,
                                                    }),
                                                });

                                                if (response.ok) {
                                                    const data = await response.json();
                                                    window.location.href = './finishChangePw.html';
                                                } else {
                                                    const errorData = await response.json();
                                                    console.error(errorData.error); 
                                                    makePopup('비밀번호 업데이트 실패');
                                                }
                                            } catch (error) {
                                                console.error('Error during password update:', error);
                                                makePopup('서버 연결 오류');
                                            }
                                        }
                                    });
                                } else {
                                    makePopup('인증 실패');
                                }
                            } catch (error) {
                                makePopup('인증 실패');
                            }
                        });
                    }
                } else {
                    makePopup(`일치하는 사용자가 없습니다`);
                }
            } else {
                makePopup('일치하는 사용자가 없습니다');
            }
        } catch (error) {
            console.error('Error:', error);
            makePopup('일치하는 사용자가 없습니다');
        }
    }
});