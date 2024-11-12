export const searchAddress = () => {
  const width = 500; // 기본 너비
  const height = 600; // 기본 높이

  // 모바일 환경 체크
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // 테마 설정
  const theme = {
    bgColor: "#f6f8fa", // 바탕 배경색
    searchBgColor: "#024CAA", // 검색창 배경색
    contentBgColor: "#ffffff", // 본문 배경색
    pageBgColor: "#ffffff", // 페이지 배경색
    textColor: "#333333", // 기본 글자색
    queryTextColor: "#ffffff", // 검색창 글자색
    emphTextColor: "#024CAA" // 강조 텍스트 색상
  };

  return new Promise((resolve) => {
    new window.daum.Postcode({
      width: isMobile ? '100%' : width,
      height: isMobile ? '100%' : height,
      animation: true,
      autoMapping: true,
      autoClose: true,

      theme: theme, // 설정한 theme 적용

      oncomplete: (data) => {
        const address = data.userSelectedType === 'R'
            ? data.roadAddress
            : data.jibunAddress;

        const result = {
          address,
          postcode: data.zonecode,
          buildingName: data.buildingName || '',
          addressType: data.userSelectedType
        };

        resolve(result);
      },

      onclose: (state) => {
        if (state === 'FORCE_CLOSE') {
          resolve(null);
        }
      }
    }).open({
      left: isMobile ? 0 : (window.innerWidth - width) / 2,
      top: isMobile ? 0 : (window.innerHeight - height) / 2,
      popupTitle: '우편번호 검색',
      popupKey: 'addressSearch',
      autoClose: true
    });
  });
};
