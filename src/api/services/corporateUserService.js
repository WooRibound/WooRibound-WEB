import handleApiCall from "@/api/apiService";

// 기업 회원 정보 조회
export const fetchEnterprise = async () => {
  try {
    const response = await handleApiCall("get", "/corporate/info", null);
    return response.data;
  } catch (error) {
    console.error("fetchEnterprise API 호출 오류:", error);
    throw error;
  }
};

// 기업회원 정보 수정
export const updateEnterpriseInfo = async (updatedInfo) => {
  try {
    const response = await handleApiCall("post", '/corporate/info/update', updatedInfo);
    return response;
  } catch (error) {
    console.error("updateEnterpriseInfo API 호출 오류:", error);
    throw error;
  }
};


// 내 기업 공고 목록 조회
export const fetchMyPostingList = async () => {
    try {
        console.debug("Making API call to fetch job postings");
        const data = await handleApiCall("get", "/corporate/jobposting");
        return data;
    } catch (error) {
        console.error("[fetchMyPostingList] Error:", error);
        throw error;
    }
};

// 내 기업 공고 상세 조회
export const fetchMyPostingDetail = async (postId) => {
    try {
        console.debug("Making API call to fetch job postings detail"+ postId);
        const encodedPostId = encodeURIComponent(postId);
        const data = await handleApiCall("get", `/corporate/jobposting/detail?postId=${encodedPostId}`);
        return data;
    } catch (error) {
        console.error("[fetchMyPostingDetail] Error:", error);
        throw error;
    }
};

// 지원자 목록 조회
export const fetchApplicantList = async (postId) => {
    try {
        console.debug("Making API call to fetch applicant list"+ postId);
        const encodedPostId = encodeURIComponent(postId);
        const data = await handleApiCall("get", `/corporate/jobposting/applicant?postId=${encodedPostId}`);
        return data;
    } catch (error) {
        console.error("[fetchApplicantList] Error:", error);
        throw error;
    }
};

// 지원자 결과 설정
export const setApplicantResult = async (payload) => {
    try {
        console.debug("Making API call to set applicant result");
        const data = await handleApiCall("post", "/corporate/jobposting/applicant/result", payload);
        return data;
    } catch (error) {
        console.error("[setApplicantResult] Error:", error);
        throw error;
    }
};

// 지원자 이력서 조회
export const fetchApplicantResume = async (userId) => {
    try {
        console.debug("Making API call to fetch Applicant Resume"+ userId);
        const encodedUserId = encodeURIComponent(userId);
        const data = await handleApiCall("get", `/corporate/jobposting/applicant/detail?userId=${encodedUserId}`);
        return data;
    } catch (error) {
        console.error("[fetchApplicantResume] Error:", error);
        throw error;
    }
};

// 직원목록 조회
export const fetchEmployeeList = async () => {
    try {
        console.debug("Making API call to fetch employee list ");
        const data = await handleApiCall("get", "/corporate/info/employee");
        return data;
    } catch (error) {
        console.error("[fetchEmployeeList] Error:", error);
        throw error;
    }
};

// 직원 추천, 비추천 설정
export const setEmployeeRating = async (payload) => {
    try {
        console.debug("Making API call to set employee recommendation");
        const data = await handleApiCall("post", "/corporate/info/employee/rating", payload);
        return data;
    } catch (error) {
        console.error("[setApplicantResult] Error:", error);
        throw error;
    }
};

// 추천 직원목록 조회
export const fetchRecommendList = async (jobId) => {
    try {
        console.debug("Making API call to fetch recommend employee list ");
       // const encodedJobId = encodeURIComponent(jobId);
        const data = await handleApiCall("get", `/corporate/jobposting/applicant-recommend?jobId=${jobId}`);
        return data;
    } catch (error) {
        console.error("[fetchRecommendList] Error:", error);
        throw error;
    }
};

// 추천 기능 프리미엄
export const fetchRecommendPremium = async (userId) => {
    try {
        console.debug("Making API call to fetch recommend premium ");
        const response = await handleApiCall("get", `corporate/jobposting/applicant-recommend/history?userId=${userId}`);
        return response.data;
    } catch (error) {
        console.error("[fetchRecommendList] Error:", error);
        throw error;
    }
};

// 공고 등록
export const insertJobPosting= async (jobPosting) => {
  const formData = new FormData();
  formData.append('postImg', jobPosting.postImg);
  formData.append('postTitle', jobPosting.postTitle);
  formData.append('jobId', jobPosting.jobId);
  formData.append('startDate', jobPosting.startDate);
  formData.append('endDate', jobPosting.endDate);

  try {
    const response = await handleApiCall('post', `corporate/jobposting/register`, formData);
    return response.data;
  } catch (error) {
    console.error('Failed to register:', error);
    throw error;
  }
};

// 채용공고 삭제
export const deleteJobPostingByCorporate = async (postId) => {
    try {
        const response = await handleApiCall('post', '/corporate/jobposting/detail/delete', null, {
            params: { postId: postId },
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response.data;
    } catch (error) {
        console.error("채용공고를 삭제하지 못했습니다. 다시 시도해 주세요.", error);
        throw error;
    }
};