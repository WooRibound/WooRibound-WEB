import handleApiCall from '@/api/apiService';

export const fetchJoinInfo = async () => {
  try {
    const response = await handleApiCall('get', '/individualuser/auth/join/info');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch join info:', error);
    throw error;
  }
}

export const join = async (data) => {
  try {
    const response = await handleApiCall('post', '/individualuser/auth/join', data)
    return response.data;
  } catch (error) {
    console.error('회원 정보 저장 실패' , error);
    throw error;
  }
}