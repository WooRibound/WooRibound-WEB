import axios from 'axios';
import { useLoadingStore } from '@/stores/loding';

const apiInstance = () => {
    const instance = axios.create({
        baseURL: process.env.VUE_APP_API_BASE_URL,
    });

    // 요청 인터셉터 추가 (옵션)
    instance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // 응답 인터셉터 추가
    instance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            if (
                error.response.status === 401 &&
                error.response.data.errorCode === 'TOKEN_EXPIRED' &&
                !originalRequest._retry
            ) {
                originalRequest._retry = true;

                try {
                    const response = await instance.post('/auth/refresh', null, {
                        withCredentials: true,
                    });
                    const newAccessToken = response.data.accessToken;
                    localStorage.setItem('accessToken', newAccessToken);
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return instance(originalRequest);
                } catch (refreshError) {
                    localStorage.removeItem('accessToken');
                    window.location.href = '/login'; // 로그인 페이지로 리다이렉트
                }
            } else if (error.response.status === 401) {
                // 다른 이유로 401 발생 시 로그아웃 또는 에러 처리
                localStorage.removeItem('accessToken');
                window.location.href = '/login'; // 로그인 페이지로 리다이렉트
            }

            return Promise.reject(error);
        }
    );

    return instance;
};

const handleApiCall = async (method, url, data = null) => {
    const loadingStore = useLoadingStore();
    loadingStore.setLoading(true); // 로딩 시작
    const api = apiInstance(); // API 인스턴스 생성
    try {
        let response;
        switch (method) {
            case 'get':
                response = await api.get(url);
                break;
            case 'post':
                response = await api.post(url, data);
                break;
            case 'put':
                response = await api.put(url, data);
                break;
            case 'delete':
                response = await api.delete(url);
                break;
            default:
                throw new Error(`Unsupported method: ${method}`);
        }
        return response.data; // 성공적으로 응답받은 데이터 반환
    } catch (error) {
        console.error(`API call failed (${method} ${url}):`, error);
        throw error; // 에러를 다시 던져서 호출자가 처리할 수 있게 함
    } finally {
        loadingStore.setLoading(false); // 로딩 종료
    }
};

export default handleApiCall;
