// stores/userStore.js
import { defineStore } from 'pinia';
import { USER_TYPES } from "@/constants/userTypes";

export const useUserStore = defineStore('user', {
    state: () => ({
        isLoggedIn: false, // 로그인 상태
        userType: USER_TYPES.INDIVIDUAL_USER,    // 사용자 유형 (개인회원, 기업회원, 서비스관리자, 인프라관리자)
    }),
    getters: {
        // 현재 사용자 상태에 따라 메시지 반환
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
                    return '알 수 없는 사용자 유형입니다.';
            }
        },
    },
    actions: {
        // 로그인
        login(userType) {
            this.isLoggedIn = true;
            this.userType = userType;
        },
        // 로그아웃
        logout() {
            this.isLoggedIn = false;
            this.userType = null;
        },
    },
});
