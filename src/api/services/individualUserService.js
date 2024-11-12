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

// 지혜 나눔 전체 목록 조회
export const fetchAllWisdomShare = async (knowhowTitle, knowhowJob) => {
  try {
    const response = await handleApiCall('get', `/individual/knowhow/share?knowhowTitle=${knowhowTitle}&knowhowJob=${knowhowJob}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch join info:', error);
    throw error;
  }
}

// 지헤 나눔 삭제
export const deleteWisdomDetail = async (knowhowId) => {
  try {
    const response = await handleApiCall('delete', `/individual/knowhow/share/delete?knowhowId=${knowhowId}`);
    return response;
  } catch (error) {
    console.error('Failed to delete wisdom detail:', error);
    throw error;
  }
}


// 지헤 나눔 등록
export const insertWisdomShare = async (postData) => {
  try {
    const response = await handleApiCall('post', '/individual/knowhow/share/register', postData);
    return response.data;
  } catch (error) {
    console.error('Failed to insert post:', error);
    throw error;
  }
}

// 지헤 탐색 전체 목록 조회
export const fetchAllWisdomExplore = async (knowhowTitle, knowhowJob) => {
  try {
    const response = await handleApiCall('get', `/individual/knowhow/explore?knowhowTitle=${knowhowTitle}&knowhowJob=${knowhowJob}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch join info:', error);
    throw error;
  }
}

// 지혜 나눔/탐색 상세 조회
export const fetchWisdomDetail = async (knowhowId) => {
  try {
    const response = await handleApiCall('get', `/individual/knowhow/detail?knowhowId=${knowhowId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch join info:', error);
    throw error;
  }
}

