/**
 * 숫자만 허용하는 유효성 검사 함수
 * @param {string} value - 입력값
 * @returns {boolean} - 유효성 검사 결과
 */
export const isNumber = (value) => {
    const numberPattern = /^\d+$/; // 숫자 패턴
    return numberPattern.test(value);
};

/**
 * 사업자 번호 형식 검사
 * @param {string} value - 입력값
 * @returns {boolean} - 유효성 검사 결과
 */
export const isBusinessNumberValid = (value) => {
    const businessNumberPattern = /^\d{3}-\d{2}-\d{5}$/; // 예시 사업자 번호 형식
    return businessNumberPattern.test(value);
};

/**
 * 이메일 형식 검사
 * @param {string} value - 입력값
 * @returns {boolean} - 유효성 검사 결과
 */
export const isEmailValid = (value) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value);
};