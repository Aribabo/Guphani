var herf = window.location.search
var id = herf.split('=')[1]
let link = `https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/admin/firstAid/view?id=${id}`

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

try {
    // 삭제
    function fn_del() {
        fetch(`https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/admin/firstAid/delete/${id}`,{
            method: 'delete',
            headers: headers
        })
        .then((response) => {return response.json()})
        .then((data) => {console.log(data)})
    }

    // 상세보기 내용 출력
    fetch(link, { headers: headers })
        .then((response) => {
            if (!response.ok) {
                throw new Error('응급처치 뷰 데이터를 가져오는 중에 오류가 발생했습니다.');
            }
            return response.json();
        })
        .then((data) => {
            document.getElementById('title').innerText = data.title;
            document.getElementById('date').innerText = (data.createdAt).split('T')[0];
            if (data.youtube) {
                document.getElementById('youtube').innerText = data.youtube;
                document.getElementById('youtube').setAttribute('href', data.youtube);
            } else {
                document.getElementById('youtube').innerText = '-';
            }
            const viewer = toastui.Editor.factory({
                el: document.querySelector('#editorWrap'),
                viewer: true,
                initialValue: data.contents
            });
        })
        .catch((error) => {
            console.error('오류가 발생했습니다:', error.message);
        });

    // 삭제 모달창
    let layerText = '';
    const delBtn = document.getElementById('delBtn');
    const textArea = document.querySelector('.layer-pop .inner-text');
    const layerBtnArea = document.querySelector('.layer-pop .btn-wrap');

    delBtn.addEventListener('click', () => {
        layerOn('firstAidViewDetailLayer');
        layerText = `해당 응급처치가 <strong class="point-txt">영구적으로 삭제됩니다</strong><br>삭제 하시겠습니까?`;
        textArea.innerHTML = layerText;
        layerBtnArea.innerHTML = `
            <button type="button" class="black-btn" onclick="layerOut('firstAidViewDetailLayer')">닫기</button>
            <button type="button" class="point-btn del" onclick="fn_del()">삭제</button>
        `;
    });



    document.addEventListener('click', (e) => {
        if (e.target.matches('.layer-pop .point-btn.del')) {
            layerText = `응급처치가 <strong class="point-txt">삭제</strong><br>되었습니다.`;
            textArea.innerHTML = layerText;
            layerBtnArea.innerHTML = `
                <button type="button" class="black-btn" onclick="window.location.href='./list.html?page=1'">닫기</button>
            `;
        }
    });

} catch (error) {
    console.error('응급처치 삭제 중에 오류가 발생했습니다:', error.message);
}
