
import {
  decodeToken,
  getAccessToken
} from "@/utils/tokenDecoder";
import handleApiCall from "@/api/apiService";
import { waitForAccessToken } from "@/utils/tokenDecoder";
import {useUserStore} from "@/stores/userStore";

export const registerUser = async (userData) => {
    const response = await handleApiCall(
        'post',
        '/individualuser/auth/join',
        userData
    );
    return response.data;
};

const processLoginResponse = async (response) => {
  try {
    console.log('Response headers:', response.headers);
    const accessToken = response.headers['access'];

    if (!accessToken) {
      console.warn('No access token found in response headers');
      throw new Error('No access token in response');
    }

    localStorage.setItem('accessToken',accessToken);
    console.log('Access Token saved:', accessToken);

    // access token 설정될 때까지 대기 (최대 1초)
    const token = await waitForAccessToken();
    if (!token) {
      throw new Error('Access token not found in localStorage after waiting');
    }

    const success = decodeToken();
    if (!success) {
      throw new Error('Failed to decode token and set user info');
    }

    return response;
  } catch (error) {
    console.error('Login process failed:', error);
    throw error;
  }
};

export const corporateLogin = async (username, password) => {
  try {
    const response = await handleApiCall('post', '/auth/enterprise/login',
        {
          username: username,
          password: password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
    );

    return await processLoginResponse(response);
  } catch (error) {
    console.error('Request failed:', error);
    if (error.response) {
      console.error('Error details:', error.response.data);
      console.error('Status:', error.response.status);
    }
    throw error;
  }
};

export const logout = async () => {
  try {
    const userStore = useUserStore();
    userStore.logout();
    // 백엔드에 리프레시 토큰 삭제 요청 api 필요.
    return true;
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
};

export const adminLogin = async (username, password) => {
  try {
    const response = await handleApiCall('post', '/auth/admin/login',
        {
          username: username,
          password: password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
    );

    return await processLoginResponse(response);
  } catch (error) {
    console.error('Request failed:', error);
    if (error.response) {
      console.error('Error details:', error.response.data);
      console.error('Status:', error.response.status);
    }
    throw error;
  }
};


export const loginCheck = async () => {
  try {
    const token = getAccessToken();

    if (!token) {
      throw new Error("No access token found");
    }

    console.log('Sending token:', token); // 디버깅용

    const response = await handleApiCall('get', '/auth/check', null);

    if (response.status === 200) {
      return true;
    }

    throw new Error(response.data?.message || 'Login check failed');
  } catch (error) {
    console.error('Login check error:', error);
    throw error;
  }
};