function hideDiv(divId) {
    try {
        const element = document.getElementById(divId);
        if (element) {
            element.style.display = 'none';
        }
    } catch (error) {
        console.error('오류가 발생했습니다:', error.message);
        handleCatchError('div 숨기기 중 오류가 발생했습니다.');
    }
}

function showDiv(divId) {
    try {
        const element = document.getElementById(divId);
        if (element) {
            element.style.display = 'block';
        }
    } catch (error) {
        console.error('오류가 발생했습니다:', error.message);
        handleCatchError('div 표시 중 오류가 발생했습니다.');
    }
}

function navigateTo(url) {
    try {
        window.location.href = url;
    } catch (error) {
        console.error('오류가 발생했습니다:', error.message);
        handleCatchError('페이지 이동 중 오류가 발생했습니다.');
    }
}

// 공통 오류 처리 함수
function handleCatchError(errorMessage) {
    console.error(errorMessage);
}
