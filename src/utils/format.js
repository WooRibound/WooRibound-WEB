/**
 * 날짜 포맷팅 MM월 DD일 (요일)
 * @param {Date} value - 입력값
 * @returns {String} - 유효성 검사 결과
 */
export const formatDate = (date) => {
    const options = { month: '2-digit', day: '2-digit' };
    const formattedDate = date.toLocaleDateString('ko-KR', options).replace(/\./g, '');

    const [month, day] = formattedDate.split(' ');

    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeek = daysOfWeek[date.getDay()]; // 0은 일요일, 1은 월요일, ...

    return `${month}월${day}일(${dayOfWeek})`;
};
