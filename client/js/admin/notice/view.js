var herf = window.location.search
var id = herf.split('=')[1]
let link = `https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/admin/notice/view?id=${id}`;

// 수정버튼 링크 변경
const modifyBtn = document.getElementById('modifyBtn')
const modifyLink = modifyBtn.getAttribute('href') + `?id=${id}`
modifyBtn.setAttribute('href', modifyLink)

// 로컬스토리지에서 토큰을 받아옴
const token = localStorage.getItem('adminToken');

// 헤더에 토큰을 넣음
const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
};

// 상세보기 내용 출력
try {
    fetch(link, {
        headers: headers
    })
    .then((response) => {return response.json()})
    .then((data) => {
        document.getElementById('title').innerText = data.title
        document.getElementById('date').innerText = (data.createdAt).split('T')[0]
        const viewer = toastui.Editor.factory({
            el: document.querySelector('#editorWrap'),
            viewer: true,
            initialValue: data.contents
        });
    })
    .catch(error => {
        console.error('Error:', error);
        handleFetchError('상세보기 내용을 불러오는 중 오류가 발생했습니다.');
    });
} catch (error) {
    console.error('오류가 발생했습니다:', error.message);
    handleCatchError('상세보기 내용을 불러오는 중 오류가 발생했습니다.');
}

// 삭제
function fn_del() {
    try {
        fetch(`https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/admin/notice/delete/${id}`, {
            method: 'delete',
            headers: headers
        })
        .then((response) => {return response.json()})
        .then((data) => {
            console.log(data);
            if (data) {
                layerText = `공지사항이 <strong class="point-txt">삭제</strong>되었습니다.`;
                textArea.innerHTML = layerText;
                layerBtnArea.innerHTML = `
                    <button type="button" class="black-btn" onclick="window.location.href='./list.html?page=1'">닫기</button>
                `;
                layerOn('noticeViewDetailLayer');
            } else {
                handleFetchError('공지사항 삭제 중 오류가 발생했습니다.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            handleFetchError('공지사항 삭제 중 오류가 발생했습니다.');
        });
    } catch (error) {
        console.error('오류가 발생했습니다:', error.message);
        handleCatchError('공지사항 삭제 중 오류가 발생했습니다.');
    }
}

// 삭제 모달창
let layerText = '';
const delBtn = document.getElementById('delBtn');
const textArea = document.querySelector('.layer-pop .inner-text');
const layerBtnArea = document.querySelector('.layer-pop .btn-wrap');

delBtn.addEventListener('click', () => {
    layerOn('noticeViewDetailLayer');
    layerText = `해당 공지사항이 <strong class="point-txt">영구적으로 삭제됩니다</strong><br>삭제 하시겠습니까?`;
    textArea.innerHTML = layerText;
    layerBtnArea.innerHTML = `
        <button type="button" class="black-btn" onclick="layerOut('noticeViewDetailLayer')">닫기</button>
        <button type="button" class="point-btn del" onclick="fn_del()">삭제</button>
    `;
});

document.addEventListener('click', (e) => {
    if (e.target.matches('.layer-pop .point-btn.del')) {
        layerText = `공지사항이 <strong class="point-txt">삭제</strong><br>되었습니다.`;
        textArea.innerHTML = layerText;
        layerBtnArea.innerHTML = `
            <button type="button" class="black-btn" onclick="window.location.href='./list.html?page=1'">닫기</button>
        `;
    }
});

// 공통 오류 처리 함수
function handleFetchError(errorMessage) {
    layerText = errorMessage;
    textArea.innerHTML = layerText;
    layerBtnArea.innerHTML = `
        <button type="button" class="black-btn" onclick="layerOut('noticeViewDetailLayer')">닫기</button>
    `;
    layerOn('noticeViewDetailLayer');
}