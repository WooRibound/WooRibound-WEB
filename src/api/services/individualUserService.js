import handleApiCall from '@/api/apiService';

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