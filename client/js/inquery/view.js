var herf = window.location.search
var id = herf.split('=')[1]

// 로컬스토리지에서 토큰을 받아옴
const token = localStorage.getItem('token');

// 상세보기 내용 출력
async function fetchData() {
    try {
        const response = await fetch(`https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/inquiry/user/view?id=${id}`,{
            headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${token}`}
        });

        if (!response.ok) {
            throw new Error('문의 상세 정보를 불러오는 중 오류가 발생했습니다.');
        }

        const data = await response.json();

        // 사용자 문의
        document.getElementById('title').innerText = data.title;
        document.getElementById('date').innerText = (data.createdAt).split('T')[0];
        document.getElementById('content').innerText = data.contents;

        // 관리자 답변
        if(data.answerDate == undefined){
            document.getElementById('admin-date').innerText = '-';
        } else {
            document.getElementById('admin-date').innerText = String(data.answerDate).split('T')[0];
        }

        const viewer = toastui.Editor.factory({
            el: document.querySelector('#editorWrap'),
            viewer: true,
            initialValue: data.answerContents
        });
    } catch (error) {
        console.error('Error in fetchData:', error.message);

    }
}

fetchData();
