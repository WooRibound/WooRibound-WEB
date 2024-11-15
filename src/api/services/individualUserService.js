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
    console.error('Failed to fetch:', error);
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
    console.error('Failed to insert:', error);
    throw error;
  }
}

// 지헤 탐색 전체 목록 조회
export const fetchAllWisdomExplore = async (knowhowTitle, knowhowJob) => {
  try {
    const response = await handleApiCall('get', `/individual/knowhow/explore?knowhowTitle=${knowhowTitle}&knowhowJob=${knowhowJob}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
}

// 지혜 나눔/탐색 상세 조회
export const fetchWisdomDetail = async (knowhowId) => {
  try {
    const response = await handleApiCall('get', `/individual/knowhow/detail?knowhowId=${knowhowId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
}

// 알림 메시지 전체 목록 조회
export const fetchAllNotification = async () => {
  try {
    const response = await handleApiCall('get', `/individual/notifications`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
}

// 알림 메세지 읽음 표시 업데이트
export const updateNotification = async (notiId) => {
  try {
    const response = await handleApiCall('put', `/individual/notifications/read?notiId=${notiId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
}

// 이력서 조회
export const fetchIndividualUserResume = async () => {
  try {
    const response = await handleApiCall('get', `/individual/info/resume`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
}

// 이력서 등록
export const insertIndividualUserResume= async (resume) => {
  const formData = new FormData();
  formData.append('userImg', resume.userImg);
  formData.append('resumeEmail', resume.resumeEmail);
  formData.append('userIntro', resume.userIntro);

  try {
    const response = await handleApiCall('post', `/individual/info/resume/regist`, formData);
    return response.data;
  } catch (error) {
    console.error('Failed to regist:', error);
    throw error;
  }
}

// 이력서 수정
export const updateIndividualUserResume= async (resume) => {
  const formData = new FormData();
  formData.append('userImg', resume.userImg);
  formData.append('resumeEmail', resume.resumeEmail);
  formData.append('userIntro', resume.userIntro);

  try {
    const response = await handleApiCall('post', `/individual/info/resume/update`, formData);
    return response.data;
  } catch (error) {
    console.error('Failed to update:', error);
    throw error;
  }
}

// 채용공고 조회
export const fetchJobPostings = async (searchInputValue, selectedIndustryValue, selectedProvinceValue) => {
  try {
      const params = {
          entName: searchInputValue,
          entField: selectedIndustryValue === '전체 산업' ? null : selectedIndustryValue,
          addrCity: selectedProvinceValue === '전체 지역' ? null : selectedProvinceValue,
      };

      const response = await handleApiCall('get', '/admin/jobposting', null, {
          params: params
      });
      return response.data;
  } catch (error) {
      console.error("fetchJobPostings API 호출 오류:", error);
      throw error;
  }
};