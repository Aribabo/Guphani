const userId = localStorage.getItem('userId');
const token = localStorage.getItem('token');

const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
};

try {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
            },
            error => {
                console.error('Geolocation 오류:', error);
            }
        );
    } else {
        console.error('Geolocation을 지원하지 않는 브라우저입니다.');
    }
} catch (error) {
    console.error('이 브라우저에서는 Geolocation을 지원하지 않습니다.');
}