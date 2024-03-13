document.addEventListener('DOMContentLoaded', function () {
    try {
        // Assume you have the user ID and success message in localStorage
        const userId = localStorage.getItem('userId');
        console.log(userId);
        const successMessage = `
    <div>
        <p class="txt txtBox"><span class="red-font txt">${userId}</span>님<br>회원가입 되었습니다</p>
    </div>`;

        // Display the content in the "result" div
        const resultElement = document.getElementById('result');
        if (resultElement) {
            resultElement.innerHTML = successMessage;
        }
    } catch (error) {
        console.error('DOM 로딩 중 오류:', error.message);
    }
});