var herf = window.location.search
var id = herf.split('=')[1]
let layerText = ''
const delBtn = document.getElementById('delBtn')
const ansBtn = document.getElementById('ansBtn')
const textArea = document.querySelector('.layer-pop .inner-text')
const layerBtnArea = document.querySelector('.layer-pop .btn-wrap')

// 로컬스토리지에서 토큰을 받아옴
const token = localStorage.getItem('adminToken');

// 헤더에 토큰을 넣음
const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
};

// 답변작성
const editor = new toastui.Editor({
    el: document.querySelector('#editorWrap'), // 에디터를 적용할 요소 (컨테이너)
    height: '500px',                        // 에디터 영역의 높이 값 (OOOpx || auto)
    initialEditType: 'markdown',            // 최초로 보여줄 에디터 타입 (markdown || wysiwyg)
    previewStyle: 'vertical'                // 마크다운 프리뷰 스타일 (tab || vertical)
});

// 뷰 상세보기
async function viewFetch() {
    try {
        const response = await fetch(`https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/admin/inquiry/view?id=${id}`,{
            headers: headers
        });

        if (!response.ok) {
            throw new Error('문의 상세 정보를 가져오는 중에 오류가 발생했습니다.');
        }

        const data = await response.json();

        document.getElementById('inquiryId').innerText = data._id
        document.getElementById('userId').innerText = data.userId
        document.getElementById('name').innerText = data.name
        document.getElementById('createdAt').innerText = String(data.createdAt).split('T')[0]
        document.getElementById('title').innerText = data.title
        document.getElementById('contents').innerText = data.contents
        editor.setMarkdown(data.answerContents);
    } catch (error) {
        console.error('오류가 발생했습니다:', error.message);
    }
}

viewFetch();

// 답변작성
async function handleEditor() {
    try {
        const answerContents = editor.getMarkdown();
        const answerDate = new Date();
        const data = await fetch(`https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/admin/inquiry/answer`, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify({id,answerContents, answerDate})
        });

        if (!data.ok) {
            throw new Error('답변 등록 중에 오류가 발생했습니다.');
        }

        const innerText = document.querySelector('#inquiryDetailLayer .inner-text')
        const layerBtnArea = document.querySelector('#inquiryDetailLayer .btn-wrap')
        
        innerText.innerText = '답변이 등록되었습니다.'
        layerBtnArea.innerHTML = `<button type="button" class="black-btn" onclick="location.reload()">닫기</button>`
        layerOn('inquiryDetailLayer');
    } catch (error) {
        console.error('오류가 발생했습니다:', error.message);
    }
}

ansBtn.addEventListener('click', () => {
    if (editor.value == '') {
        layerText = '내용을 입력해주세요.'
        editor.focus()
        layerOn('inquiryDetailLayer')

        return false
    }

    handleEditor()
});

// 문의 삭제
delBtn.addEventListener('click', () => {
    try {
        layerOn('inquiryDetailLayer')
        layerText = `해당답변이 <strong class="point-txt">영구적으로 삭제됩니다</strong><br>삭제 하시겠습니까?`
        textArea.innerHTML = layerText
        layerBtnArea.innerHTML = `
            <button type="button" class="black-btn" onclick="layerOut('inquiryDetailLayer')">닫기</button>
            <button type="button" class="point-btn del" onclick="delFetch('${id}')">삭제</button>
        `
    } catch (error) {
        console.error('오류가 발생했습니다:', error.message);
    }
});

async function delFetch(id) {
    console.log(id);
    try {
        const response = await fetch(`https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/admin/inquiry/delete/${id}`,{
            method:'DELETE',
            headers:headers
        });

        if (!response.ok) {
            throw new Error('문의 삭제 중에 오류가 발생했습니다.');
        }

        const innerText = document.querySelector('#inquiryDetailLayer .inner-text')
        const layerBtnArea = document.querySelector('#inquiryDetailLayer .btn-wrap')
        innerText.innerText = '문의가 삭제 되었습니다.'
        layerBtnArea.innerHTML = `<button type="button" class="black-btn" onclick="window.location.href='./list.html'">닫기</button>`
        layerOn('inquiryDetailLayer');
    } catch (error) {
        console.error('오류가 발생했습니다:', error.message);
    }
}
