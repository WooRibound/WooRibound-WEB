import { useUserStore } from '@/stores/userStore';

export const getAccessToken = () => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) return null;

  // "Bearer " 부분 제거
  return accessToken.replace('Bearer ', '');
};

export const decodeToken = () => {
  try {
    const store = useUserStore();
    const accessToken = getAccessToken();

    if (!accessToken) {
      return null;
    }

    const base64Url = accessToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    // UTF-8 디코딩을 위한 수정
    const jsonPayload = decodeURIComponent(
        window.atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload = JSON.parse(jsonPayload);

    const role = payload.role;
    let userType;

    switch(role) {
      case 'ROLE_SERVICE_ADMIN':
        userType = '서비스관리자';
        break;
      case 'ROLE_INFRA_ADMIN':
        userType = '인프라관리자';
        break;
      case 'ROLE_ENTERPRISE_USER':
        userType = '기업회원';
        break;
      case 'ROLE_WbUser':
        userType = '개인회원';
        break;
      default:
        userType = 'UNKNOWN';
    }

    store.setUserInfo({
      userName: payload.userName,
      userType: userType
    });

    return true;
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
};

// 필요한 경우 토큰 설정 대기를 위한 함수
export const waitForAccessToken = async (maxAttempts = 10, interval = 100) => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const accessToken = getAccessToken();
    if (accessToken) {
      return accessToken;
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  return null;
};