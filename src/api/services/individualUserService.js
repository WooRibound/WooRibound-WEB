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

// 1. 공고 조회 - 검색(회사명, 직무, 지역)
export const fetchJobPostings = async (payload = {}) => {
  try {
    const response = await handleApiCall('post', '/individualuser/jobposting', payload);
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

// 2. 공고 조회 - 새로운 일 구하기
export const fetchJobPostingsNew = async (payload = {}) => {
  try {
    const response = await handleApiCall('post', '/individualuser/jobposting/new', payload);
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

// 3. 공고 조회 - 경력 살리기
export const fetchJobPostingsCareer = async (payload = {}) => {
  try {
    const response = await handleApiCall('post', '/individualuser/jobposting/career', payload);
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};




// 지원 현황 조회
export const fetchJobApply = async () => {
  try {
    const response = await handleApiCall('get', `/individualuser/info/jobposting/myapply?userId=USER001`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
}

// 채용 공고 상세 조회
export const fetchJobPostingDetail = async (postId) => {
  try {
    const response = await handleApiCall('get', `/individualuser/jobposting/detail?postId=${postId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
}

// 채용 공고 지원
export const insertUserApply = async (postId) => {
  try {
    const response = await handleApiCall('post', `/individualuser/jobposting/apply?postId=${postId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
}

// 채용 공고 지원 취소
export const deleteUserApply = async (applyId) => {
  try {
    const response = await handleApiCall('post', `/individualuser/info/apply/cancel?applyId=${applyId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
}

export const fetchJobPoint = async () => {
  try {
    const response = await handleApiCall('get', '/individualuser/info/wbpoint');
        return response.data; // 신뢰도 점수 반환
  } catch (error) {
    console.error('신뢰도 점수 조회 실패', error);
    throw error;
  }
};

export const fetchUserProfile = async () => {
  try {
    const response = await handleApiCall('get', '/individualuser/info');
    return response.data; // 회원 정보를 반환
  } catch (error) {
    console.error("회원 정보 조회 실패", error);
    throw error;
  }
};

export const fetchUpdateUserProfile = async (payload) => {
  try {
    const response = await handleApiCall('post', '/individualuser/info/update', payload);
    return response.data; // 업데이트 결과 반환
  } catch (error) {
    console.error("회원 정보 수정 실패", error);
    throw error;
  }
};