document.addEventListener('DOMContentLoaded', function () {
    const loginBtn = document.getElementById('loginBtn');

    if (loginBtn) {
        loginBtn.addEventListener('click', fn_login);
    }

    // 로그인 유효성 검사
    async function fn_login() {
        try {
            const userid = document.getElementById('userid');
            const userpw = document.getElementById('userpw');
            const error = document.querySelector('#login .error');

            if (userid.value === '') {
                error.innerText = '아이디를 입력해주세요.';
                userid.focus();
                error.style.display = 'block';
                return false;
            }

            if (userpw.value === '') {
                error.innerText = '비밀번호를 입력해주세요.';
                userpw.focus();
                error.style.display = 'block';
                return false;
            }

            const response = await fetch('https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/auth/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: userid.value,
                    password: userpw.value,
                }),
            });

            if (response.ok) {
                const data = await response.json();

                // Store the token in localStorage
                localStorage.setItem('adminToken', data.token);

                window.location.href = 'list.html';
            }
        } catch (error) {
            console.error('Error in fn_login function:', error);
            makePopup('로그인 정보를 확인해주세요'); // 사용자에게 보여줄 메시지
        }
    }
});

// 레이어 팝업창
function layerOn(el) {
    try {
        const layer = document.getElementById(el);
        layer.classList.add('fadeIn');
        layer.classList.remove('fadeOut');
    } catch (error) {
        console.error('Error in layerOn function:', error);
            }
}

function layerOut(el) {
    try {
        const layer = document.getElementById(el);
        layer.classList.add('fadeOut');
        layer.classList.remove('fadeIn');
    } catch (error) {
        console.error('Error in layerOut function:', error);
            }
}

function makePopup(popupMessage) {
    try {
        const message = document.getElementById('message');
        message.innerText = popupMessage;

        // 팝업창 열기
        layerOn('loginLayer');
    } catch (error) {
        console.error('Error in makePopup function:', error);
            }
}
