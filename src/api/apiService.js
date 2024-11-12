import axios from 'axios';
import { useLoadingStore } from '@/stores/useLodingStore';
import { useUserStore } from "@/stores/userStore";
import {ROUTES} from "@/router/routes";

let refreshTokenRequest = null; // 중복 갱신 요청 방지 변수

const apiInstance = () => {
    const instance = axios.create({
        baseURL: process.env.VUE_APP_API_BASE_URL,
        withCredentials: true // 쿠키를 포함하여 요청 전송
    });

    // 요청 인터셉터
    instance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers['Authorization'] = token;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // 응답 인터셉터
    instance.interceptors.response.use(
        response => response,
        async error => {
            const originalRequest = error.config;
            console.log('Response error:', {
                status: error.response?.status,
                data: error.response?.data
            });

            // 삭제된 유저 처리 (410 상태 코드)
            if (error.status === 410) {
                console.log('Deleted user detected, redirecting to deleted user page');
                window.location.href = ROUTES.DELETED_USER_REDIRECT.path;
                return Promise.reject(error);
            }

            // 토큰 만료 에러 처리 (419 상태 코드)
            if (error.response?.status === 419 && !originalRequest._retry) {
                console.log('Token expired, attempting refresh');
                originalRequest._retry = true;

                try {
                    // 리프레시 토큰을 사용하여 액세스 토큰 재발급 요청
                    const tokenResponse = await refreshAccessToken();

                    if (tokenResponse.status === 200) {
                        const newAccessToken = tokenResponse.data;
                        localStorage.setItem('accessToken', `Bearer ${newAccessToken}`);
                        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                        // 새로운 액세스 토큰으로 원래 요청 재시도
                        return instance(originalRequest);
                    } else {
                        // 리프레시 토큰 요청 실패 시 로그아웃 처리
                        useUserStore().logout();
                        window.location.href = '/login';
                        return Promise.reject(new Error('Token refresh failed'));
                    }
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                    useUserStore().logout();
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error);
        }
    );

    return instance;
};

// 리프레시 토큰을 사용하여 액세스 토큰 재발급 요청
async function refreshAccessToken() {
    if (!refreshTokenRequest) {
        refreshTokenRequest = axios.post('/auth/refresh', {}, {
            baseURL: process.env.VUE_APP_API_BASE_URL,
            withCredentials: true
        });
    }

    try {
        const response = await refreshTokenRequest;
        return response;
    } finally {
        refreshTokenRequest = null;
    }
}

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
                return status >= 200 && status < 400; // 200-499 상태 코드는 에러로 처리하지 않음
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
