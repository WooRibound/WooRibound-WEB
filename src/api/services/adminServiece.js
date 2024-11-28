import handleApiCall from '@/api/apiService';


// 채용공고 삭제
export const deleteJobPosting= async (postId) => {
    try {
        const response = await handleApiCall('post', `/admin/jobposting/delete?postId=${postId}`);
        return response;
    } catch (error) {
        console.error('Failed to delete:', error);
        throw error;
    }
}

// 채용공고 목록 조회
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

// 채용공고 삭제
export const confirmDelete = async (postId) => {
    try {
        const response = await handleApiCall('post', '/admin/jobposting/delete', null, {
            params: { postId: postId },
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response;
    } catch (error) {
        console.error("채용공고를 삭제하지 못했습니다. 다시 시도해 주세요.", error);
        throw error;
    }
};

// 채용 공고 상세 조회
export const fetchJobPostingDetail = async (postId) => {
    try {
      const response = await handleApiCall('get',  `/admin/jobposting/detail?postId=${postId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch:', error);
      throw error;
    }
  }

// 로그 대시보드 페이지 요청
export const fetchLogDashboard = async () => {
    try {
      const response = await handleApiCall('get', '/admin/auth/dashboard');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch:', error);
      throw error;
    }
};

// 채용공고 삭제
export const deleteJobPostingByAdmin = async (postId) => {
    try {
        const response = await handleApiCall('post', '/admin/jobposting/delete', null, {
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