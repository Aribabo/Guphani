var herf = window.location.search;
var id = herf.split('=')[1];
let link = `https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/admin/firstAid/modify?id=${id}`;
const modifyBtn = document.getElementById('modifyBtn');
const textArea = document.querySelector('.layer-pop .inner-text');
const layerBtnArea = document.querySelector('.layer-pop .btn-wrap');
const aditerWrap = document.getElementById('editorWrap');

// 로컬스토리지에서 토큰을 받아옴
const token = localStorage.getItem('adminToken');

// 헤더에 토큰을 넣음
const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
};

// 에디터 생성
const editor = new toastui.Editor({
    el: document.querySelector('#editorWrap'),
    height: '500px',
    initialEditType: 'markdown',
    initialValue: '내용을 입력해 주세요.',
    previewStyle: 'vertical',
    hooks: {
        addImageBlobHook: async (blob, callback) => {
            const formData = new FormData();
            formData.append('file', blob);

            try {
                const response = await fetch('https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/admin/firstAid/modify/imgUpload', {
                    method: 'POST',
                    body: formData,
                    headers: headers,
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log(result);
                    // 이미지 업로드 성공 시 이미지 경로를 에디터에 추가
                    callback(`../../../img/uploads/${result.url}`, '이미지');
                } else {
                    console.error('이미지 업로드 실패');
                }
            } catch (error) {
                console.error('이미지 업로드 중 에러 발생', error);
            }
        },
    },
});

editor.removeToolbarItem('image');

// 상세보기 내용 출력
function fn_fetch() {
    try {
        fetch(link, {
            headers: headers,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('상세 정보를 불러오는 데 실패했습니다.');
                }
                return response.json();
            })
            .then((data) => {
                document.getElementById('title').value = data.title;
                if (data.youtube) {
                    document.getElementById('youtube').value = data.youtube;
                } else {
                    document.getElementById('youtube').value = '-';
                }
                editor.setMarkdown(data.contents);
            })
            .catch((error) => {
                console.error('Error:', error);
                
            });
    } catch (error) {
        console.error('상세보기 내용 출력 중 에러가 발생했습니다:', error);
        
    }
}
fn_fetch();

// 뒤로가기 링크 변경
const backBtn = document.getElementById('backBtn');
const backLink = backBtn.getAttribute('href') + `?id=${id}`;
backBtn.setAttribute('href', backLink);

// 에디터 내용 서버로 전송
async function handleEditor(blob, callback) {
    try {
        // editor의 인스턴스를 사용해 에디터에 있는 내용을 마크 다운으로 불러온다.
        // html로 불러오는 방법은 getHTML()을 사용하면된다.
        const contents = editor.getMarkdown();
        const title = document.getElementById('title').value;
        const youtube = document.getElementById('youtube').value;

        // fetch를 할 때, body에 JSON으로 불러온 데이터를 보낸다.
        const data = await fetch(`https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/admin/firstAid/modify/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ title, contents, youtube }),
        });

        if (!data.ok) {
            throw new Error('응급처치 수정에 실패했습니다.');
        }
    } catch (error) {
        console.error('응급처치 에디터 내용 서버로 전송 중 에러가 발생했습니다:', error);
    }
}

modifyBtn.addEventListener('click', () => {
    try {
        layerOn('firstAidModifyLayer');
        layerText = `응급처치가<br><strong class="point-txt">수정</strong> 되었습니다.`;
        textArea.innerHTML = layerText;
        window.location.href = `./view.html?id=${id}`;
        handleEditor();
        fn_fetch();
    } catch (error) {
        console.error('응급처치 수정시 에러가 발생했습니다:', error);
    }
});
