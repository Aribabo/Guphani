document.addEventListener('DOMContentLoaded', () => {
    const inquiryBtn = document.getElementById('inquiryreg');
    const searchSelect = document.getElementById('searchSelect')
    const sorts = searchSelect.querySelectorAll('li span')
    const title = document.getElementById('title')
    const contents = document.getElementById('contents')
    const sort = document.getElementById('sort');
    sorts.forEach((el) => {
        el.addEventListener('click', () => {
            sort.value = el.innerText
        })
    })

    const userId = localStorage.getItem('_id');
    const token = localStorage.getItem('token');

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    inquiryBtn.addEventListener('click', async () => {
        try {
            const layerText = document.getElementById('layerText')

            // 문의등록 버튼 클릭 시 sort value에 inquiryType innerText를 넣어줌
            const inquiryType = document.querySelector('.inquiry-type')
            sort.value = inquiryType.innerText

            if (sort.value == '문의 분류를 선택하세요') {
                sort.value == ''
                layerText.innerText = '문의 분류를 선택해주세요.'
                layerOn('inquireFormLayer')
                return false
            }

            if (sort.value.trim() == '') {
                layerText.innerText = '문의 분류를 선택하세요.'
                layerOn('inquireFormLayer')
                return false
            }
            if (title.value.trim() == '') {
                layerText.innerText = '제목을 입력해주세요.'
                layerOn('inquireFormLayer')
                title.focus()
                return false
            }
            if (contents.value.trim() == '') {
                layerText.innerText = '내용을 입력해주세요.'
                layerOn('inquireFormLayer')
                return false
            }

            const response = await fetch(`https://port-0-guphani-final-1gksli2alpullmg3.sel4.cloudtype.app/inquiry/user/write`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ userId, title: title.value, contents: contents.value, sort: sort.value })
            })

            if (response.ok) {
                const btnWrap = document.querySelector('#inquireFormLayer .btn-wrap')
                layerText.innerText = '등록이 완료되었습니다.'
                layerOn('inquireFormLayer')

                btnWrap.innerHTML = `
                <button type="button" class="black-btn" onclick="window.location.href = './inquiryList.html'">닫기</button>
                `
            } else {
                layerText.innerText = '등록에 실패했습니다. 서버 오류가 발생했습니다.';
                layerOn('inquireFormLayer');
            }
        } catch (error) {
            console.error('Error in inquiryBtn click event:', error);
                    }
    })
});
