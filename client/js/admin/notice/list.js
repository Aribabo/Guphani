const titleSearch = document.getElementById('titleSearch');
const contentSearch = document.getElementById('contentSearch');
const startDate = document.getElementById('startDate');
const endDate = document.getElementById('endDate');
const schBtn = document.getElementById('schBtn');
const table = document.querySelector('.list-table-wrap table');
const tbody = table.querySelector('tbody');
const pageUl = document.getElementById('pageUl');
const totalCnt = document.querySelector('.list-table-wrap .total');
let link = 'https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/admin/notice/list';
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
const allAgree = document.querySelector('.list-table-wrap #allAgree')

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
function fetchUsers(queryString = '', page = 1) {
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
        .then(data => {
            totalCnt.innerText = `총 ${data.notices.total}개`;

            // totalPages 변수를 설정
            const totalPages = data.notices.totalPage;

            if (data.notices.data.length === 0) {
                html += `<tr><td colspan="6">데이터가 없습니다</td></tr>`;
            } else {
                data.notices.data.forEach((el, idx) => {
                    const postNumber = (page - 1) * 10 + idx + 1;
                    html += `
                    <tr>
                        <td><input type="checkbox" name="" id="check${idx + 1}" class="type1" value='${el._id}'></td>
                        <td>${postNumber}</td>
                        <td>${el.title}</td>
                        <td><p class='ellip2'>${el.contents}</p></td>
                        <td>${String(el.createdAt).split('T')[0]}</td>
                        <td><button type="button" onclick="location='./view.html?id=${el._id}'" class="gray-btn view-btn">상세보기</button></td>
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
        .catch(error => console.error('Error:', error));
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
    const title = urlParams.get('title') || '';
    const contents = urlParams.get('contents') || '';
    const start = urlParams.get('startDate') || '';
    const end = urlParams.get('endDate') || '';
    const pageNum = parseInt(urlParams.get('page') || '1', 10);

    // 검색 필드에 값 설정
    titleSearch.value = title;
    contentSearch.value = contents;
    startDate.value = start;
    endDate.value = end;

    // 현재 검색 조건으로 데이터 불러오기
    const query = { title, contents, startDate: start, endDate: end };
    currentSearchQuery = Object.keys(query)
        .filter(key => query[key] !== '')
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
        .join('&');

    fetchUsers(currentSearchQuery, pageNum);
}

window.onload = loadSearchConditions;

// 검색 이벤트
schBtn.addEventListener('click', () => {
    const query = {};
    page = 1;

    if (titleSearch.value) query.title = titleSearch.value;
    if (contentSearch.value) query.contents = contentSearch.value;
    if (startDate.value && endDate.value) {
        query.startDate = startDate.value;
        query.endDate = endDate.value;
    }

    currentSearchQuery = Object.keys(query)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
        .join('&');

    fetchUsers(currentSearchQuery, 1);
});


// 삭제 모달창 및 체크된 id확인
let layerText = ''
const delBtn = document.getElementById('delBtn')
const textArea = document.querySelector('.layer-pop .inner-text')
const layerBtnArea = document.querySelector('.layer-pop .btn-wrap')
const selectDel = document.getElementById('selectDel')
let delArr = []
selectDel.addEventListener('click',()=>{
    delArr = []
    agrees = document.querySelectorAll('.list-table-wrap tbody input[type="checkbox"]')
    agrees.forEach((el)=>{
        if(el.checked == true){
            delArr.push(el.value)
        }
    })
    const datas = {
        ids: delArr
    };

    if(delArr.length == 0){
        layerText = `선택된 공지사항이 없습니다.` 
        textArea.innerHTML = layerText
        layerBtnArea.innerHTML = `
        <button type="button" class="black-btn" onclick="layerOut('noticeViewDetailLayer')">닫기</button>`
    }else{
        layerText = `해당공지사항이 <strong class="point-txt">영구적으로 삭제됩니다</strong><br>삭제 하시겠습니까?`
        textArea.innerHTML = layerText
        layerBtnArea.innerHTML = `
            <button type="button" class="black-btn" onclick="layerOut('noticeViewDetailLayer')">닫기</button>
            <button type="button" class="point-btn del" onclick="fn_del()">삭제</button>
        `
    }

    layerOn('noticeViewDetailLayer')

    document.addEventListener('click',(e)=>{
        if (e.target.matches('.layer-pop .point-btn.del')) {
            layerText = `답변이 <strong class="point-txt">삭제</strong><br>되었습니다.`
            textArea.innerHTML = layerText
            layerBtnArea.innerHTML = `
                <button type="button" class="black-btn" onclick="window.location.href='./list.html?page=1'">닫기</button>
            `
        }
        // 선택삭제 패치
        fetch(`https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/admin/notice/delete`,{
            method: 'delete',
            headers: {
                'Content-Type': 'application/json', // 전송하는 데이터의 형식을 지정합니다.
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(datas)
        })
        .then((response) => {return response.json()})
        .then((data) => {console.log(data)})
    
    })

})

// 초기화 버튼
const resetBtn = document.getElementById('resetBtn')
resetBtn.addEventListener('click',()=>{
    titleSearch.value = ''
    contentSearch.value = ''
    startDate.value = ''
    endDate.value = ''
})




