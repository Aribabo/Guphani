// 리스트
window.addEventListener('click', (e) => {
    try {
        let detail;

        // 함수를 이용해서 부모의 클래스에 따라 detail을 찾음
        const findDetail = (element) => {
            if (element.classList.contains('list')) {
                return element.children[3];
            } else if (element.classList.contains('head')) {
                return element.parentElement.children[3];
            } else if (element.classList.contains('body')) {
                return element.parentElement.children[3];
            } else if (element.classList.contains('foot')) {
                return element.parentElement.children[3];
            } else {
                return null;
            }
        };

        detail = findDetail(e.target);

        if (detail) {
            if (detail.classList.contains('fadeIn')) {
                detail.classList.add('fadeOut');
                detail.classList.remove('fadeIn');
            } else {
                detail.classList.add('fadeIn');
                detail.classList.remove('fadeOut');
            }
        }
    } catch (error) {
        console.error('리스트 클릭 이벤트 처리 중 오류 발생:', error);
    }
});