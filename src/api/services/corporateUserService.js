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

