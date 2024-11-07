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