import handleApiCall from '@/api/apiService';

// 사용 예시 (다른 파일에서 이 함수를 가져와 사용할 수 있음)
// import { fetchData, postData, updateData, deleteData } from '@/api/CorporateUserService';

// GET 요청 함수
export const fetchData = async () => {
    try {
        const data = await handleApiCall('get', '/your/api/endpoint');
        console.log(data);
        return data; // 데이터를 반환
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // 오류를 다시 던져서 호출자가 처리할 수 있게 함
    }
};

// POST 요청 함수
export const postData = async (payload) => {
    try {
        const response = await handleApiCall('post', '/your/api/endpoint', payload);
        console.log(response);
        return response; // 응답을 반환
    } catch (error) {
        console.error('Error posting data:', error);
        throw error; // 오류를 다시 던져서 호출자가 처리할 수 있게 함
    }
};

// PUT 요청 함수
export const updateData = async (id, payload) => {
    try {
        const response = await handleApiCall('put', `/your/api/endpoint/${id}`, payload);
        console.log(response);
        return response; // 응답을 반환
    } catch (error) {
        console.error('Error updating data:', error);
        throw error; // 오류를 다시 던져서 호출자가 처리할 수 있게 함
    }
};

// DELETE 요청 함수
export const deleteData = async (id) => {
    try {
        const response = await handleApiCall('delete', `/your/api/endpoint/${id}`);
        console.log(response);
        return response; // 응답을 반환
    } catch (error) {
        console.error('Error deleting data:', error);
        throw error; // 오류를 다시 던져서 호출자가 처리할 수 있게 함
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






