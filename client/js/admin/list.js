const nameSearch = document.getElementById('name');
const idSearch = document.getElementById('id');
const genderSearch = document.getElementsByName('gender');
const schBtn = document.getElementById('schBtn');
const table = document.querySelector('.list-table-wrap table');
const tbody = document.querySelector('.list-table-wrap tbody');
const pageUl = document.getElementById('pageUl');
const totalCnt = document.querySelector('.list-table-wrap .total');
let link = 'https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/auth/users';
let html = '';
let paging = '';
let currentSearchQuery = '';

// 로컬스토리지에서 토큰을 받아옴
const token = localStorage.getItem('adminToken');

// 헤더에 토큰을 넣음
const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
};

// 데이터와 페이징 가져오기
function fetchUsers(queryString = '', page = 1) {
    try {
        html = '';
        paging = '';

        let fetchUrl = link;
        if (queryString !== '') {
            fetchUrl += `?${queryString}&page=${page}`;
        } else {
            fetchUrl += `?page=${page}`;
        }

        fetch(fetchUrl, {
            headers: headers
        })
            .then(response => response.json())
            .then((data) => {
                totalCnt.innerText = `총 ${data.users.total}개`;
                // totalPages 변수를 설정
                const totalPages = data.users.totalPage;

                if (data.users.data.length === 0) {
                    html += `<tr class="no-data"><td colspan="10">데이터가 없습니다</td></tr>`;
                } else {
                    data.users.data.forEach((el, idx) => {
                        const postNumber = (page - 1) * 10 + idx + 1;
                        html += `
                            <tr>
                                <td>${postNumber}</td>      
                                <td>${el.id}</td>
                                <td>${el.name}</td>
                                `
                                if(el.gender == "m"){
                                    html += `<td>남자</td>`
                                }else if(el.gender == "w"){
                                    html += `<td>여자</td>`
                                }
                                html +=`
                                <td>${el.birthdate}</td>
                                <td>${maskPhoneNumber(el.phoneNumber)}</td>`

                                if(el.isUser == 'Y'){
                                    html += `<td class="point-txt">${el.isUser}</td>`
                                }else if(el.isUser == 'N'){
                                    html += `<td>${el.isUser}</td>`
                                }
                                if(el.isAdmin == 'Y'){
                                    html += `<td class='point-txt'>${el.isAdmin}</td>`
                                }else if(el.isAdmin == 'N'){
                                    html += `<td>${el.isAdmin}</td>`
                                }
                                html +=`
                                <td>${String(el.joinDate).split('T')[0]}</td>
                                <td><a href="./view.html?id=${el._id}" class="gray-btn view-btn">상세보기</a></td>
                            </tr>
                        `;
                    });
                }
                tbody.innerHTML = html;

                paging += '<ul>';
                if (page > 1) {
                    paging += `<li class="prev"><a href="#" onclick="changePage(${page - 1}, '${queryString}')"><i class="xi-angle-left"></i></a></li>`;
                }
                for (let i = 1; i <= totalPages; i++) {
                    if (page === i) {
                        paging += `<li class='on'><a href="#" onclick="changePage(${i}, '${queryString}')">${i}</a></li>`;
                    } else {
                        paging += `<li><a href="#" onclick="changePage(${i}, '${queryString}')">${i}</a></li>`;
                    }
                }
                if (page < totalPages) {
                    paging += `<li class="next"><a href="#" onclick="changePage(${page + 1}, '${queryString}')"><i class="xi-angle-right"></i></a></li>`;
                }
                paging += '</ul>';

                pageUl.innerHTML = paging;
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                const errorMessage = '사용자 목록을 불러오는 중 오류가 발생했습니다.';
                
            });
    } catch (error) {
        console.error('Error in fetchUsers function:', error);
        const errorMessage = '데이터를 불러오는 중 오류가 발생했습니다.';
        
    }
}

function maskPhoneNumber(phoneNumber) {
    // Check if the phone number has at least 4 characters
    if (phoneNumber.length >= 4) {
        const maskedDigits = '*'.repeat(4);
        return phoneNumber.slice(0, -4) + maskedDigits;
    } else {
        // Handle cases where the phone number has fewer than 4 characters
        return phoneNumber;
    }
}

// 페이지 변경 함수
function changePage(newPage, queryString) {
    try {
        page = newPage;
        const newUrl = `./list.html?page=${newPage}${queryString ? `&${queryString}` : ''}`;
        window.location.href = newUrl;
    } catch (error) {
        console.error('Error in changePage function:', error);
        const errorMessage = '페이지 변경 중 오류가 발생했습니다.';
        
    }
}

// 페이지 로드 시 URL에서 검색 조건을 추출하고 적용하는 함수
function loadSearchConditions() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const name = urlParams.get('name') || '';
        const id = urlParams.get('id') || '';
        const gender = urlParams.get('gender') || '';
        const pageNum = parseInt(urlParams.get('page') || '1', 10);

        // 검색 필드에 값 설정
        nameSearch.value = name;
        idSearch.value = id;
        genderSearch.value = gender;

        // 현재 검색 조건으로 데이터 불러오기
        const query = { name, id, gender};
        currentSearchQuery = Object.keys(query)
            .filter(key => query[key] !== '')
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
            .join('&');

        fetchUsers(currentSearchQuery, pageNum);
    } catch (error) {
        console.error('Error in loadSearchConditions function:', error);
        const errorMessage = '검색 조건을 불러오는 중 오류가 발생했습니다.';
        
    }
}

window.onload = loadSearchConditions;

// 검색 이벤트
schBtn.addEventListener('click', () => {
    try {
        const query = {};
        page = 1;
        if (nameSearch.value) query.name = nameSearch.value;
        if (idSearch.value) query.id = idSearch.value;
        genderSearch.forEach((el)=>{
            if(el.checked){
                query.gender = el.value; 
            }
        })

        currentSearchQuery = Object.keys(query)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
            .join('&');

        fetchUsers(currentSearchQuery, 1);
    } catch (error) {
        console.error('Error in search event:', error);
        const errorMessage = '검색 중 오류가 발생했습니다.';
        
    }
});

const resetBtn = document.getElementById('resetBtn')
resetBtn.addEventListener('click',()=>{
    try {
        nameSearch.value = '';
        idSearch.value = '';
        genderSearch.forEach((el)=>{
            el.checked = false;
        });
    } catch (error) {
        console.error('Error in reset event:', error);
        const errorMessage = '초기화 중 오류가 발생했습니다.';
        
    }
});
