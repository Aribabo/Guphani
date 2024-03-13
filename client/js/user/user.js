// 로그인 유효성 검사
const loginBtn = document.getElementById('loginBtn');
function fn_login(params) {
    try {
        const userid = document.getElementById('userid');
        const userpw = document.getElementById('userpw');
        const error = document.querySelector('#login .error')

        if (userid.value == '') {
            error.innerText = '아이디를 입력해주세요.'
            userid.focus()
            error.style.display = 'block'
            return false
        }
        if (userpw.value == '') {
            error.innerText = '비밀번호를 입력해주세요.'
            userpw.focus()
            error.style.display = 'block'

            return false
        }
    } catch (error) {
        console.error('로그인 유효성 검사 오류:', error.message);
    }
}

// 회원가입 이용약관동의
function viewMore(el) {
    try {
        let detail = el.parentElement.nextElementSibling

        if (detail.classList.contains('fadeIn')) {
            detail.classList.add('fadeOut')
            detail.classList.remove('fadeIn')
            el.style.transform = 'rotate(360deg)'
        } else {
            detail.classList.add('fadeIn')
            detail.classList.remove('fadeOut')
            el.style.transform = 'rotate(270deg)'
        }
    } catch (error) {
        console.error('이용약관 동의 오류:', error.message);
    }
}
// register1 회원가입1 페이지
function check() {
    try {
        // 동의사항 체크박스들의 상태를 확인
        const allAgree = document.getElementById('allAgree');
        const agree1 = document.getElementById('agree1');
        const agree2 = document.getElementById('agree2');

        // 모든 체크박스가 체크되었는지 확인
        if (allAgree.checked && agree1.checked && agree2.checked) {
            // 모두 체크된 경우 register2.html로 이동
            window.location.href = 'register2.html';
        } else {
            // 하나라도 체크되지 않은 경우 a 함수 실행 또는 다른 작업 수행
            layerOn('register1Layer');
        }
    } catch (error) {
        console.error('체크 오류:', error.message);
    }
}

// register1 전체동의 체크박스의 이벤트 리스너 추가
const allAgree = document.getElementById('allAgree');
allAgree.addEventListener('change', function () {
    try {
        const agree1 = document.getElementById('agree1');
        const agree2 = document.getElementById('agree2');

        // 전체동의 체크박스 상태에 따라 나머지 체크박스들의 상태 변경
        agree1.checked = allAgree.checked;
        agree2.checked = allAgree.checked;
    } catch (error) {
        console.error('체크박스 상태 변경 오류:', error.message);
    }
});

// register1 개별 동의 체크박스들의 이벤트 리스너 추가
const individualAgrees = document.querySelectorAll('.type1');
individualAgrees.forEach(function (individualAgree) {
    individualAgree.addEventListener('change', function () {
        try {
            const agree1 = document.getElementById('agree1');
            const agree2 = document.getElementById('agree2');

            // 개별 체크박스 상태에 따라 전체동의 체크박스 상태 변경
            allAgree.checked = agree1.checked && agree2.checked;
        } catch (error) {
            console.error('개별 체크박스 상태 변경 오류:', error.message);
        }
    });
});

// register2 시작
// user_register2.js에서 확인바람