// Function to calculate age from birthdate
function calculateAge(birthdate) {
    try {
        // Parse the birthdate string into a Date object
        const birthDateObject = new Date(
            parseInt(birthdate.substr(0, 4)),
            parseInt(birthdate.substr(4, 2)) - 1,
            parseInt(birthdate.substr(6, 2))
        );

        // Get the current date
        const currentDate = new Date();

        // Calculate the difference in years
        let age = currentDate.getFullYear() - birthDateObject.getFullYear();

        // Adjust age if the birthday hasn't occurred yet this year
        if (
            currentDate.getMonth() < birthDateObject.getMonth() ||
            (currentDate.getMonth() === birthDateObject.getMonth() &&
                currentDate.getDate() < birthDateObject.getDate())
        ) {
            age--;
        }

        return age;
    } catch (error) {
        console.error('나이 계산 중 오류 발생:', error.message);
        return null; // 또는 오류 처리에 맞게 값을 반환
    }
}

// Function to generate list items for diseases and allergies
function generateListItems(className, items) {
    try {
        if (items[0] !== '') {
            return items.map(item => `<li class="${className}"><span>${item}</span></li>`).join('');
        }
        return ''
    } catch (error) {
        console.error('리스트 아이템 생성 중 오류 발생:', error.message);
        return ''; // 또는 오류 처리에 맞게 값을 반환
    }
}

async function info_fetch() {
    const id = localStorage.getItem('userId')
    const token = localStorage.getItem('token')
    if(token){
        const response = await fetch(`https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/auth/user/info/${id}`,{
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        })
        .then((result) => {return result.json()})
        .then((user)=>{
            let indexInfo = ''
            let mypageInfo =''
            let list = ''
            const mypageInfoWrap = document.querySelector('.mypage-info')
    
            const userInfoElement = document.querySelector('.user-info');
            const userUtilElement = document.querySelector('#index .util-wrap');
            const mypageList = document.querySelector('.mypage-list');
    
        
            if (userInfoElement && userUtilElement) {
                // 두 요소가 모두 존재할 때 실행할 코드
                const userInfoWrap = userInfoElement;
                const userUtilWrap = userUtilElement;
            
                let indexInfo = `
                <div class="login-on">
                    <div class="name">${user.name ? `${user.name}님` : ''}</div>
                    <div class="user-sub">
                        ${user.bloodType ? `<span>${user.bloodType}형</span>` : ''}
                        ${user.birthdate ? `<span>${calculateAge(user.birthdate)}세</span>` : ''}
                    </div>
                    <ul>
                    ${generateListItems('disease', user.underlyingDisease)} 
                    ${generateListItems('allergy', user.allergy)}
                    </ul>
                </div>`;
            
                userInfoWrap.innerHTML = indexInfo;
            
                userUtilWrap.innerHTML = `<button type="button" class="mypageBtn" onclick="mypageOn()">마이페이지</button>
                                        <button type="button" class="logout" id="logoutBtn">로그아웃</button>`;
            }
    
            mypageInfo += `
                <p class="mypagename">${user.name} 님</p>
                <ul class="info-list">
                <li class="info-firstlist">${user.birthdate ? `<span>${calculateAge(user.birthdate)}세</span>` : ''}</li>
                <li class="info-secondlist">${user.bloodType ? `<span>${user.bloodType}형</span>` : ''}</li>
                </ul>
            `     
            mypageInfoWrap.innerHTML = mypageInfo 

            if(mypageList.classList.contains('index')){
                list +=`
                <li><a href="./user/updateUserInfo.html">회원정보 수정</a></li>
                <li><a href="./mypage/inquiryList.html">문의하기</a></li>
                <li><a href="./mypage/notice.html">공지사항</a></li>
                <li><a href="./mypage/service.html">서비스이용약관</a></li>
                <li><a href="./mypage/personal.html">개인정보 처리방침</a></li>
                <li><a href="#" id="logoutBtn">로그아웃</a></li>
                <li onclick="withdrawal()"><a>회원탈퇴</a></li>
                `
            }else{
                list +=`
                <li><a href="../user/updateUserInfo.html">회원정보 수정</a></li>
                <li><a href="../mypage/inquiryList.html">문의하기</a></li>
                <li><a href="../mypage/notice.html">공지사항</a></li>
                <li><a href="../mypage/service.html">서비스이용약관</a></li>
                <li><a href="../mypage/personal.html">개인정보 처리방침</a></li>
                <li><a href="#" id="logoutBtn2">로그아웃</a></li>
                <li onclick="withdrawal()"><a>회원탈퇴</a></li>
                `
            }

            mypageList.innerHTML = list
        })
    }
}

info_fetch()

const loginUserData = JSON.parse(localStorage.getItem('user'));
(function () {
    try {
        function includeHtml() {
            const includeTarget = document.querySelectorAll('.includeJs');
            includeTarget.forEach(function (el, idx) {
                const targetFile = el.dataset.includeFile;
                if (targetFile) {
                    let xhttp = new XMLHttpRequest();

                    xhttp.onreadystatechange = function () {
                        if (this.readyState === XMLHttpRequest.DONE) {
                            this.status === 200 ? (el.innerHTML = this.responseText) : null
                            this.status === 404 ? (el.innerHTML = 'include not found.') : null
                        }
                    }
                    xhttp.open('GET', targetFile, true);
                    xhttp.send();
                    return;
                }
            });
        };

        includeHtml();
    } catch (error) {
        console.error('includeHtml 함수 실행 중 오류 발생:', error);
    }
})();

// 레이어 팝업창
function layerOn(el) {
    try {
        const layer = document.
            getElementById(el)
        layer.classList.add('fadeIn')
        layer.classList.remove('fadeOut')
    } catch (error) {
        console.error('레이어 팝업창을 표시하는 도중 오류 발생:', error);
    }
}
function layerOut(el) {
    try {
        const layer = document.getElementById(el)
        layer.classList.add('fadeOut')
        layer.classList.remove('fadeIn')
    } catch (error) {
        console.error('레이어 팝업창을 표시하는 도중 오류 발생:', error);
    }
}

// 마이페이지
const bodyTag = document.querySelector('body')
function mypageOn() {
    try {
        layerOn('mypage')
        bodyTag.style.overflow = 'hidden'
    } catch (error) {
        console.error('마이페이지를 표시하는 도중 오류 발생:', error);
    }
}
function mypageOut() {
    try {
        layerOut('mypage')
        bodyTag.style.overflow = 'unset'
    } catch (error) {
        console.error('마이페이지를 닫는 도중 오류 발생:', error);
    }
}

// 로그아웃
window.addEventListener('click', (e) => {
    try {
        const logoutBtn = document.getElementById('logoutBtn')
        const logoutBtn2 = document.getElementById('logoutBtn2')
        if (e.target.id == 'logoutBtn') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            localStorage.removeItem('userId')
            location.reload()
        }
        if(e.target.id == 'logoutBtn2'){
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            localStorage.removeItem('userId')
            window.location.href = '../index.html'
        }
    } catch (error) {
        console.error('로그아웃 중 오류 발생:', error.message);
    }
});


function withdrawal() {
    const userId = localStorage.getItem('userId')
    layerOn('withdrawalLayer')
    const withdrawalBtn = document.querySelector('.withdrawalBtn')
    const txtWrap = document.querySelector('.txt-wrap')
    const btnWrap = document.querySelector('.btn-wrap')
    withdrawalBtn.addEventListener('click', () => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        try {
            const response = fetch(`https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/auth/user/withdraw/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            if (response.ok) {
                console.log('탈퇴완료');
            }
        } catch (error) {
            console.error('Error during deletion:', error);
        }

        txtWrap.innerText = '회원탈퇴가 완료되었습니다.'
        
        btnWrap.innerHTML = `<button type="button" class="black-btn" onclick="location.reload()">닫기</button>`
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        
    })

}