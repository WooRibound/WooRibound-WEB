// stores/userStore.js
import { defineStore } from 'pinia';
import { USER_TYPES } from "@/constants/userTypes";

export const useUserStore = defineStore('user', {
    state: () => ({
        isLoggedIn: false,
        userName: "방문자",
        userType: USER_TYPES.INDIVIDUAL_USER,
    }),

    getters: {
        statusMessage: (state) => {
            if (!state.isLoggedIn) {
                return '로그인하지 않았습니다.';
            }
            switch (state.userType) {
                case USER_TYPES.INDIVIDUAL_USER:
                    return '개인유저로 로그인하셨습니다.';
                case USER_TYPES.CORPORATE_MEMBER:
                    return '기업유저로 로그인하셨습니다.';
                case USER_TYPES.SERVICE_ADMIN:
                    return '서비스관리자로 로그인하셨습니다.';
                case USER_TYPES.INFRA_ADMIN:
                    return '인프라관리자로 로그인하셨습니다.';
                default:
                    return `알 수 없는 사용자 유형입니다: ${state.userType}`;
            }
        },
        getCurrentUserName: (state) => state.userName,
        getCurrentUserType: (state) => state.userType,
        isAuthenticated: (state) => state.isLoggedIn,
    },

    actions: {
        setUserInfo({ userName, userType }) {
            this.isLoggedIn = true;
            this.userName = userName;
            this.userType = userType;
        },

        logout() {
            localStorage.removeItem('accessToken');
            this.isLoggedIn = false;
            this.userName = "방문자";
            this.userType = USER_TYPES.INDIVIDUAL_USER;
        },
    },

    // 상태를 자동으로 로컬 스토리지에 저장 및 불러오기
    persist: {
        storage: localStorage,
    },
});
