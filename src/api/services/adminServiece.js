import handleApiCall from '@/api/apiService';

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
        console.log("삭제 결과:", response);
        return response;
    } catch (error) {
        console.error("채용공고를 삭제하지 못했습니다. 다시 시도해 주세요.", error);
        throw error;
    }
};