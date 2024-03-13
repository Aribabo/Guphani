const modal = document.getElementById('inquirysh');
const btn = document.querySelector('.input-area button');
const input = document.querySelector('.input-area input[type="text"]');

// 모달 외부 클릭 시 모달 닫기
window.addEventListener('click', (event) => {
  try {
    if (
      event.target !== modal &&
      event.target !== btn &&
      event.target !== input &&
      !modal.contains(event.target)
    ) {
      modal.classList.add('fadeOut');
      modal.classList.remove('fadeIn');
    }
  } catch (error) {
    console.error('모달 닫기 중 오류 발생:', error.message);
  }
});
try {
  function changeInquiryType(type) {
    const inquiryTypeSpan = document.getElementById('inquiry-type');
    inquiryTypeSpan.textContent = type;
  }
} catch (error) {
  console.error('문의 유형 변경 중 오류 발생:', error.message);
}