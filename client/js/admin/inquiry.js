let layerText = '';
const modifyBtn = document.getElementById('modifyBtn');
const delBtn = document.getElementById('delBtn');
const ansBtn = document.getElementById('ansBtn');
const textArea = document.querySelector('.layer-pop .inner-text');
const layerBtnArea = document.querySelector('.layer-pop .btn-wrap');

ansBtn.addEventListener('click', () => {
    try {
        layerOn('inquiryDetailLayer');
        layerText = `답변이<br><strong class="point-txt">등록</strong> 되었습니다.`;
        textArea.innerHTML = layerText;
    } catch (error) {
        console.error('답변 등록 중 오류 발생:', error);
        
    }
});

delBtn.addEventListener('click', () => {
    try {
        layerOn('inquiryDetailLayer');
        layerText = `해당답변이 <strong class="point-txt">영구적으로 삭제됩니다</strong><br>삭제 하시겠습니까?`;
        textArea.innerHTML = layerText;
        layerBtnArea.innerHTML = `
            <button type="button" class="black-btn" onclick="layerOut('inquiryDetailLayer')">닫기</button>
            <button type="button" class="point-btn del">삭제</button>
        `;
    } catch (error) {
        console.error('답변 삭제 중 오류 발생:', error);
        
    }
});

document.addEventListener('click', (e) => {
    try {
        if (e.target.matches('.layer-pop .point-btn.del')) {
            layerText = `답변이 <strong class="point-txt">삭제</strong><br>되었습니다.`;
            textArea.innerHTML = layerText;
            layerBtnArea.innerHTML = `
                <button type="button" class="black-btn" onclick="layerOut('inquiryDetailLayer')">닫기</button>
            `;
        }
    } catch (error) {
        console.error('답변 삭제 결과 표시 중 오류 발생:', error);
        
    }
});
