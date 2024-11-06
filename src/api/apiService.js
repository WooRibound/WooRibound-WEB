import axios from 'axios';
import { useLoadingStore } from '@/stores/useLodingStore';

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

const handleApiCall = async (method, url, data = null, options = {}) => {
    const loadingStore = useLoadingStore();
    loadingStore.setLoading(true);

    try {
        const api = apiInstance();
        let response;
        const config = {
            ...options,
            withCredentials: true,
            validateStatus: function (status) {
                return status >= 200 && status < 500; // 200-499 상태 코드는 에러로 처리하지 않음
            }
        };

        switch (method.toLowerCase()) {
            case 'post':
                response = await api.post(url, data, config);
                break;
            case 'get':
                response = await api.get(url, config);
                break;
            case 'put':
                response = await api.put(url, data, config);
                break;
            case 'delete':
                response = await api.delete(url, config);
                break;
            default:
                throw new Error(`Unsupported method: ${method}`);
        }

        return response;
    } catch (error) {
        console.error('API call failed:', {
            method,
            url,
            error: {
                message: error.message,
                response: error.response,
                request: error.request
            }
        });

        // 에러 객체 구조화
        const errorResponse = {
            status: error.response?.status,
            data: error.response?.data,
            headers: error.response?.headers,
            message: error.message
        };

        throw errorResponse;
    } finally {
        loadingStore.setLoading(false);
    }
};

export default handleApiCall;
