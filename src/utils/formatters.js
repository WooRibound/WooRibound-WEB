/**
 * 날짜 포맷팅 MM월 DD일 (요일)
 * @param {Date} value - 입력값
 * @returns {String}
 */
export const formatDate1 = (dateString) => {
    const date = new Date(dateString);

    const options = { month: '2-digit', day: '2-digit' };
    const formattedDate = date.toLocaleDateString('ko-KR', options).replace(/\./g, '');

    const [month, day] = formattedDate.split(' ');

    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeek = daysOfWeek[date.getDay()]; // 0은 일요일, 1은 월요일, ...

    return `${month}월${day}일(${dayOfWeek})`;
};

/**
 * 날짜 포맷팅 YYYY.MM.DD
 * @param {Date} value - 입력값
 * @returns {String}
 */
export const formatDate2 = (dateString) => {
    const date = new Date(dateString);

    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = date.toLocaleDateString('ko-KR', options).replace(/\./g, '');

    const [year, month, day] = formattedDate.split(' ');

    return `${year}.${month}.${day}`;
};

/**
 * 휴대폰 번호를 포맷팅하는 함수
 * @param {string} phoneNumber - 입력된 휴대폰 번호
 * @returns {string} 포맷된 휴대폰 번호
 */
export function formatPhoneNumber(phoneNumber) {
    const value = phoneNumber.replace(/[^0-9]/g, ''); // 숫자만 남김
    if (value.length <= 3) {
        return value; // 3자리 이하 그대로 출력
    } else if (value.length <= 7) {
        return `${value.slice(0, 3)}-${value.slice(3)}`; // 3-4 형태
    } else {
        return `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`; // 3-4-4 형태
    }
}

