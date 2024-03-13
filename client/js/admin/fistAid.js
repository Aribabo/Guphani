let layerText = '';
const modifyBtn = document.getElementById('modifyBtn');
const delBtn = document.getElementById('delBtn');
const textArea = document.querySelector('.layer-pop .inner-text');
const layerBtnArea = document.querySelector('.layer-pop .btn-wrap');

modifyBtn.addEventListener('click', () => {
    try {
        layerOn('filstAidDetailLayer');
        layerText = `응급처치가<br><strong class="point-txt">수정</strong> 되었습니다.`;
        textArea.innerHTML = layerText;
    } catch (error) {
        console.error('응급처치 수정 중 오류 발생:', error);
        
    }
});

delBtn.addEventListener('click', () => {
    try {
        layerOn('filstAidDetailLayer');
        layerText = `응급처치가 <strong class="point-txt">영구적으로 삭제됩니다</strong><br>삭제 하시겠습니까?`;
        textArea.innerHTML = layerText;
        layerBtnArea.innerHTML = `
            <button type="button" class="black-btn" onclick="layerOut('filstAidDetailLayer')">닫기</button>
            <button type="button" class="point-btn del">삭제</button>
        `;
    } catch (error) {
        console.error('응급처치 삭제 중 오류 발생:', error);
        
    }
});

document.addEventListener('click', (e) => {
    try {
        if (e.target.matches('.layer-pop .point-btn.del')) {
            layerText = `응급처치가 <strong class="point-txt">삭제</strong><br>되었습니다.`;
            textArea.innerHTML = layerText;
            layerBtnArea.innerHTML = `
                <button type="button" class="black-btn" onclick="layerOut('filstAidDetailLayer')">닫기</button>
            `;
        }
    } catch (error) {
        console.error('응급처치 삭제 결과 표시 중 오류 발생:', error);
        
    }
});
