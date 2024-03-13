const nameSearch = document.getElementById('name');
const contentSearch = document.getElementById('contents');
const sortSearch = document.getElementById('sort')
const answerStatusSearch = document.getElementsByName('answerStatus')
const schBtn = document.getElementById('schBtn');
const table = document.querySelector('.list-table-wrap table');
const tbody = document.querySelector('.list-table-wrap tbody');
const pageUl = document.getElementById('pageUl');
const totalCnt = document.querySelector('.list-table-wrap .total');
let link = 'https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/admin/inquiry/list';
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

// 체크박스 전체선택
const allAgree = document.getElementById('allAgree')

allAgree.addEventListener('change', () => {
    agrees.forEach((el) => {
        el.checked = allAgree.checked;
    });
});

document.addEventListener('click', function (el) {
    if(el.target.type == 'checkbox' ){
        agrees = document.querySelectorAll('.list-table-wrap tbody input[type="checkbox"]')
        // 개별 체크박스에 클릭 이벤트 리스너 추가
        agrees.forEach(function (agree) {
            agree.addEventListener('change', () => {
                // 하나라도 체크가 해제되었을 때 "allAgree" 체크박스도 해제
                if (!agree.checked) {
                    allAgree.checked = false;
                } else {
                    // 모든 체크박스가 체크되었을 때 "allAgree" 체크박스도 체크
                    const allChecked = Array.from(agrees).every((cb) => cb.checked);
                    allAgree.checked = allChecked;
                }
            });
        });
    }
})

// 데이터와 페이징 가져오기
function fetchInquirys(queryString = '', page = 1) {
    html = '';
    paging = '';

    let fetchUrl = link;
    if (queryString !== '') {
        fetchUrl += `?${queryString}&page=${page}`;
    } else {
        fetchUrl += `?page=${page}`;
    }

    try {
        fetch(fetchUrl, {
            headers: headers
        })
            .then(response => response.json())
            .then(data => {
                totalCnt.innerText = `총 ${data.inquirys.total}개`;
                // totalPages 변수를 설정
                const totalPages = data.inquirys.totalPage;

                if (data.inquirys.data.length === 0) {
                    html += `<tr><td colspan="10">데이터가 없습니다</td></tr>`;
                } else {
                    data.inquirys.data.forEach((el, idx) => {
                        const postNumber = (page - 1) * 10 + idx + 1;
                        html += `
                        <tr>
                            <td><input type="checkbox" name="agree" id="agree${idx}" value="${el._id}" class="type1"></td>
                            <td>${postNumber}</td>
                            <td>${el.name}</td>
                            <td>${el.sort}</td>
                            <td><p class="ellip1">${el.title}</p></td>
                            <td><p class="ellip1">${el.contents}</p></td>
                            <td>${String(el.createdAt).split('T')[0]}</td>`;
                        if (el.answerStatus == 'N') {
                            html += `<td class="point-txt">대기</td>`;
                        } else if (el.answerStatus == 'Y') {
                            html += `<td>완료</td>`;
                        }
                        if (el.answerDate == undefined) {
                            html += `<td>-</td>`;
                        } else {
                            html += `<td>${String(el.answerDate).split('T')[0]}</td>`;
                        }
                        html += `<td><a href="./view.html?id=${el._id}" class="gray-btn view-btn">상세보기</a></td>
                        </tr>`;
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
            });
    } catch (error) {
        console.error('데이터와 페이징 가져오기 중 오류가 발생했습니다:', error.message);
    }
}

// 페이지 변경 함수
function changePage(newPage, queryString) {
    page = newPage;
    const newUrl = `./list.html?page=${newPage}${queryString ? `&${queryString}` : ''}`;
    window.location.href = newUrl;
}

// 페이지 로드 시 URL에서 검색 조건을 추출하고 적용하는 함수
function loadSearchConditions() {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name') || '';
    const contents = urlParams.get('contents') || '';
    const answerStatus = urlParams.get('answerStatus') || '';
    const sort = urlParams.get('sort') || '';
    const pageNum = parseInt(urlParams.get('page') || '1', 10);

    // 검색 필드에 값 설정
    nameSearch.value = name;
    contentSearch.value = contents;
    answerStatusSearch.value = answerStatus;
    sortSearch.value = sort;

    // 현재 검색 조건으로 데이터 불러오기
    const query = { name, contents, answerStatus, sort };
    currentSearchQuery = Object.keys(query)
        .filter(key => query[key] !== '')
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
        .join('&');

    fetchInquirys(currentSearchQuery, pageNum);
}

window.onload = loadSearchConditions;

// 검색 이벤트
schBtn.addEventListener('click', () => {
    const query = {};
    page = 1;
    if (nameSearch.value) query.name = nameSearch.value;
    if (contentSearch.value) query.contents = contentSearch.value;
    if (sortSearch.value) query.sort = sortSearch.value;
    answerStatusSearch.forEach((el) => {
        if (el.checked) {
            query.answerStatus = el.value;
        }
    })

    currentSearchQuery = Object.keys(query)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
        .join('&');

    fetchInquirys(currentSearchQuery, 1);
});

// 삭제 모달창 및 체크된 id확인
let layerText = ''
const delBtn = document.getElementById('delBtn')
const textArea = document.querySelector('.layer-pop .inner-text')
const layerBtnArea = document.querySelector('.layer-pop .btn-wrap')
const selectDel = document.getElementById('selectDel')
let delArr = []
selectDel.addEventListener('click', () => {
    delArr = []
    agrees = document.querySelectorAll('.list-table-wrap tbody input[type="checkbox"]')
    agrees.forEach((el) => {
        if (el.checked == true) {
            delArr.push(el.value)
        }
    })
    const datas = {
        ids: delArr
    };

    console.log(datas);
    if (delArr.length == 0) {
        layerText = `선택된 문의사항이 없습니다.` 
        textArea.innerHTML = layerText
        layerBtnArea.innerHTML = `
        <button type="button" class="black-btn" onclick="layerOut('inquiryListLayer')">닫기</button>`
    } else {
        layerText = `해당 문의사항이 <strong class="point-txt">영구적으로 삭제됩니다</strong><br>삭제 하시겠습니까?`
        textArea.innerHTML = layerText
        layerBtnArea.innerHTML = `
            <button type="button" class="black-btn" onclick="layerOut('inquiryListLayer')">닫기</button>
            <button type="button" class="point-btn del" onclick="fn_del()">삭제</button>
        `
    }

    layerOn('inquiryListLayer')

    document.addEventListener('click', (e) => {
        if (e.target.matches('.layer-pop .point-btn.del')) {
            layerText = `문의가 <strong class="point-txt">삭제</strong><br>되었습니다.`
            textArea.innerHTML = layerText
            layerBtnArea.innerHTML = `
                <button type="button" class="black-btn" onclick="window.location.href='./list.html?page=1'">닫기</button>
            `
        }
        // 선택삭제 패치
        fetch(`https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/admin/inquiry/delete`, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json', // 전송하는 데이터의 형식을 지정합니다.
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(datas)
        })
            .then((response) => { return response.json() })
            .then((data) => { console.log(data) })
            .catch((error) => {
                console.error('선택삭제 중 오류가 발생했습니다:', error.message);
            });
    })
});

// 초기화 버튼
const resetBtn = document.getElementById('resetBtn')
resetBtn.addEventListener('click', () => {
    nameSearch.value = ''
    contentSearch.value = ''
    sortSearch.value = ''
    answerStatusSearch.forEach((el) => {
        el.checked = false
    })
});
