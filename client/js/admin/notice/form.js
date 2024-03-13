const postBtn = document.getElementById('postBtn');
const textArea = document.querySelector('.layer-pop .inner-text');
const layerBtnArea = document.querySelector('.layer-pop .btn-wrap');

// 로컬스토리지에서 토큰을 받아옴
const token = localStorage.getItem('adminToken');

// 헤더에 토큰을 넣음
const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
};

// 상세보기 내용 출력
function fn_fetch(link) {
    try {
        fetch(link, {
            headers: headers
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('상세보기 내용을 불러오는 중에 오류가 발생했습니다.');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('title').value = data.title;
            editor.setMarkdown(data.contents);
        });
    } catch (error) {
        console.error('오류가 발생했습니다:', error.message);
        
    }
}


editor.removeToolbarItem('image');

// 에디터 내용 및 타이틀 내용 서버로 전송
async function handleEditor() {
    try {
        const title = document.getElementById('title').value;
        const contents = editor.getMarkdown();    
        const data = await fetch(`https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/admin/notice/write`, {
            method: "POST",
            headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ title, contents })
        }).then((response) =>{return response.json()})
        .then((data) => {
            document.getElementById('closeBtn').addEventListener('click', () => {
                window.location.href = `./view.html?id=${data._id}`;
            });
        });

        if (!data.ok) {
            throw new Error('공지사항을 등록하는 중에 오류가 발생했습니다.');
        }
    } catch (error) {
        console.error('오류가 발생했습니다:', error.message);
        
    }
}

postBtn.addEventListener('click', () => {
    try {
        const title = document.getElementById('title');
        const contents = editor.getMarkdown();


        if (title.value === '') {
            layerText = '제목을 입력해주세요.';
            textArea.innerHTML = layerText;
            title.focus();
            layerOn('noticePostLayer');
            return false;
        }

        if (contents === '') {
            layerText = '내용을 입력해주세요.';
            textArea.innerHTML = layerText;
            layerOn('noticePostLayer');
            return false;
        }

        layerText = `공지사항이<br><strong class="point-txt">등록</strong> 되었습니다.`;
        textArea.innerHTML = layerText;
        layerOn('noticePostLayer');
        handleEditor();
        fn_fetch();
    } catch (error) {
        console.error('오류가 발생했습니다:', error.message);
        
    }
});
