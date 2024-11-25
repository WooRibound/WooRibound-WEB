import { useUserStore } from '@/stores/userStore';
import {USER_TYPES} from "@/constants/userTypes";

export const getAccessToken = () => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) return null;
  let token = accessToken.replace('Bearer ', '').trim();
  return token;
};

export const getAccessTokenWithBearer = () => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) return null;
  return accessToken
};

export const decodeToken = () => {
  try {
    const userStore = useUserStore();
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
        userType = USER_TYPES.SERVICE_ADMIN;
        break;
      case 'ROLE_INFRA_ADMIN':
        userType = USER_TYPES.INDIVIDUAL_USER;
        break;
      case 'ROLE_ENTERPRISE_USER':
        userType = USER_TYPES.CORPORATE_MEMBER;
        break;
      case 'ROLE_WbUser':
        userType = USER_TYPES.INDIVIDUAL_USER;
        break;
      default:
        userType = USER_TYPES.UNKNOWN;
    }

    userStore.login({
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