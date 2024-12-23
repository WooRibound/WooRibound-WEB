import { createRouter, createWebHistory } from "vue-router";
import { ROUTES } from "@/router/routes";
import { useUserStore } from "@/stores/userStore";
import { USER_TYPES } from "@/constants/userTypes";
import { decodeToken } from "@/utils/tokenDecoder";
import { useLoginModalStore } from "@/stores/useLoginModalStore";

const router = createRouter({
    history: createWebHistory(""),
    routes: [
        {
            path: ROUTES.NOT_FOUND_PAGE.path,
            name: ROUTES.NOT_FOUND_PAGE.name,
            component: () => import("@/views/Error/NotFindPageView.vue"),
            meta: { requiresAuth: false }, // 모든 사용자 접근 가능
        },
        {
            path: ROUTES.MAIN.path,
            name: ROUTES.MAIN.name,
            component: () => import("@/views/Common/MainView.vue"),
            meta: { requiresAuth: false }, // 모든 사용자 접근 가능
        },
        {
            path: ROUTES.ADMIN_MAIN.path,
            name: ROUTES.ADMIN_MAIN.name,
            component: () => import("@/views/Common/AdminMain.vue"),
            meta: { requiresAuth: true, allowedUserTypes: [USER_TYPES.INFRA_ADMIN, USER_TYPES.SERVICE_ADMIN] },
        },
        {
            path: ROUTES.NOTIFICATION_PAGE.path,
            name: ROUTES.NOTIFICATION_PAGE.name,
            component: () => import("@/views/IndividualUser/NotificationPage.vue"),
            meta: { requiresAuth: true, allowedUserTypes: USER_TYPES.INDIVIDUAL_USER },
        },
        {
            path: ROUTES.JOB_APPLICATION_STATUS.path,
            name: ROUTES.JOB_APPLICATION_STATUS.name,
            component: () => import("@/views/IndividualUser/JobApplicationStatus.vue"),
            meta: { requiresAuth: true, allowedUserTypes: USER_TYPES.INDIVIDUAL_USER },
        },
        {
            path: ROUTES.JOB_APPLICATION_STATUS_DETAIL.path,
            name: ROUTES.JOB_APPLICATION_STATUS_DETAIL.name,
            component: () => import("@/views/IndividualUser/JobApplicationStatusDetail.vue"),
            meta: { requiresAuth: true, allowedUserTypes: USER_TYPES.INDIVIDUAL_USER },
        },
        {
            path: ROUTES.RESUME_PAGE.path,
            name: ROUTES.RESUME_PAGE.name,
            component: () => import("@/views/IndividualUser/ResumePage.vue"),
            meta: { requiresAuth: true, allowedUserTypes: USER_TYPES.INDIVIDUAL_USER },
        },
        {
            path: ROUTES.INDIVIDUAL_USER_PROFILE.path,
            name: ROUTES.INDIVIDUAL_USER_PROFILE.name,
            component: () => import("@/views/IndividualUser/IndividualUserProfile.vue"),
            meta: { requiresAuth: true, allowedUserTypes: USER_TYPES.INDIVIDUAL_USER },
        },
        {
            path: ROUTES.WOORIBOUND_ELEVATION_INFO.path,
            name: ROUTES.WOORIBOUND_ELEVATION_INFO.name,
            component: () => import("@/views/IndividualUser/WooriboundElevationInfo.vue"),
            meta: { requiresAuth: true, allowedUserTypes: USER_TYPES.INDIVIDUAL_USER },
        },
        {
            path: ROUTES.JOB_POSTINGS_PAGE.path,
            name: ROUTES.JOB_POSTINGS_PAGE.name,
            component: () => import("@/views/IndividualUser/JobPostingsPage.vue"),
            meta: { requiresAuth: false }, // 모든 사용자 접근 가능
        },
        {
            path: ROUTES.LOGIN.path,
            name: ROUTES.LOGIN.name,
            component: () => import("@/views/Authentication/LoginView.vue"),
            meta: { requiresAuth: false }, // 모든 사용자 접근 가능
        },
        {
            path: ROUTES.ADMIN_LOGIN.path,
            name: ROUTES.ADMIN_LOGIN.name,
            component: () => import("@/views/Authentication/AdminLoginView.vue"),
            meta: { requiresAuth: false }, // 모든 사용자 접근 가능
        },
        {
            path: ROUTES.INDIVIDUAL_USER_REGISTER.path,
            name: ROUTES.INDIVIDUAL_USER_REGISTER.name,
            component: () => import("@/views/Authentication/IndividualUserRegisterView.vue"),
            meta: { requiresAuth: false }, // 모든 사용자 접근 가능
        },
        {
            path: ROUTES.CORPORATE_USER_REGISTER.path,
            name: ROUTES.CORPORATE_USER_REGISTER.name,
            component: () => import("@/views/Authentication/CorporateUserRegisterView.vue"),
            meta: { requiresAuth: false }, // 모든 사용자 접근 가능
        },
        {
            path: ROUTES.CORPORATE_USER_FIND_PASSWORD.path,
            name: ROUTES.CORPORATE_USER_FIND_PASSWORD.name,
            component: () => import("@/views/Authentication/CorporateUserFindPasswordView.vue"),
            meta: { requiresAuth: false }, // 모든 사용자 접근 가능
        },
        {
            path: ROUTES.JOB_POSTING_DETAIL.path,
            name: ROUTES.JOB_POSTING_DETAIL.name,
            component: () => import("@/views/IndividualUser/JobPostingDetail.vue"),
            meta: { requiresAuth: false }, // 모든 사용자 접근 가능
        },
        {
            path: ROUTES.INDIVIDUAL_USER_DELETE.path,
            name: ROUTES.INDIVIDUAL_USER_DELETE.name,
            component: () => import("@/views/IndividualUser/IndividualUserDelete.vue"),
            meta: { requiresAuth: true, allowedUserTypes: USER_TYPES.INDIVIDUAL_USER },
        },
        {
            path: ROUTES.CORPORATE_USER_DELETE.path,
            name: ROUTES.CORPORATE_USER_DELETE.name,
            component: () => import("@/views/CorporateUser/CorporateUserDelete.vue"),
            meta: { requiresAuth: true, allowedUserTypes: USER_TYPES.CORPORATE_MEMBER },
        },
        {
            path: ROUTES.DELETE_SUCCESS.path,
            name: ROUTES.DELETE_SUCCESS.name,
            component: () => import("@/views/Common/UserDeleteSuccess.vue"),
            meta: { requiresAuth: false }, // 모든 사용자 접근 가능
        },
        {
            path: ROUTES.CORPORATE_DELETE_SUCCESS.path,
            name: ROUTES.CORPORATE_DELETE_SUCCESS.name,
            component: () => import("@/views/Common/CorporateDeleteSuccess.vue"),
            meta: { requiresAuth: false }, // 모든 사용자 접근 가능
        },
        {
            path: ROUTES.CORPORATE_USER_ACCOUNT_MENU.path,
            name: ROUTES.CORPORATE_USER_ACCOUNT_MENU.name,
            component: () => import("@/views/CorporateUser/CorporateUserAccountMenu.vue"),
            meta: { requiresAuth: true, allowedUserTypes: USER_TYPES.CORPORATE_MEMBER },
        },
        {
            path: ROUTES.CORPORATE_USER_PROFILE.path,
            name: ROUTES.CORPORATE_USER_PROFILE.name,
            component: () => import("@/views/CorporateUser/CorporateUserProfile.vue"),
            meta: { requiresAuth: true, allowedUserTypes: USER_TYPES.CORPORATE_MEMBER },
        },
        {
            path: ROUTES.JOB_POSTING_MANAGEMENT.path,
            name: ROUTES.JOB_POSTING_MANAGEMENT.name,
            component: () => import("@/views/CorporateUser/JobPostingManagement.vue"),
            meta: { requiresAuth: true, allowedUserTypes: USER_TYPES.CORPORATE_MEMBER },
        },
        {
            path: ROUTES.JOB_POSTING_REGISTER.path,
            name: ROUTES.JOB_POSTING_REGISTER.name,
            component: () => import("@/views/CorporateUser/JobPostingRegister.vue"),
            meta: { requiresAuth: true, allowedUserTypes: USER_TYPES.CORPORATE_MEMBER },
        },
        {
            path: ROUTES.CORPORATE_USER_JOB_POSTING_DETAIL.path,
            name: ROUTES.CORPORATE_USER_JOB_POSTING_DETAIL.name,
            component: () => import("@/views/CorporateUser/CorporateUserJobPostingDetail.vue"),
            meta: { requiresAuth: true, allowedUserTypes: [USER_TYPES.CORPORATE_MEMBER, USER_TYPES.SERVICE_ADMIN] },
        },
        {
            path: ROUTES.APPLICANT_DETAIL_PAGE.path,
            name: ROUTES.APPLICANT_DETAIL_PAGE.name,
            component: () => import("@/views/CorporateUser/ApplicantDetailPage.vue"),
            meta: { requiresAuth: true, allowedUserTypes: USER_TYPES.CORPORATE_MEMBER },
        },
        {
            path: ROUTES.APPLICANT_RECOMMEND_PAGE.path,
            name: ROUTES.APPLICANT_RECOMMEND_PAGE.name,
            component: () => import("@/views/CorporateUser/ApplicantRecommendPage.vue"),
            meta: { requiresAuth: true, allowedUserTypes: USER_TYPES.CORPORATE_MEMBER },
        },
        {
            path: ROUTES.RECOMMEND_PREMIUM_PAGE.path,
            name: ROUTES.RECOMMEND_PREMIUM_PAGE.name,
            component: () => import("@/views/CorporateUser/RecommendPremium.vue"),
        },
        {
            path: ROUTES.READONLY_RESUME_PAGE.path,
            name: ROUTES.READONLY_RESUME_PAGE.name,
            component: () => import("@/views/CorporateUser/ReadonlyResumePage.vue"),
            meta: { requiresAuth: true, allowedUserTypes: [USER_TYPES.CORPORATE_MEMBER, USER_TYPES.SERVICE_ADMIN] },
        },
        {
            path: ROUTES.EMPLOYEE_MANAGEMENT.path,
            name: ROUTES.EMPLOYEE_MANAGEMENT.name,
            component: () => import("@/views/CorporateUser/EmployeeManagement.vue"),
            meta: { requiresAuth: true, allowedUserTypes: USER_TYPES.CORPORATE_MEMBER },
        },
        {
            path: ROUTES.WORK_EXPERIENCE_SHARING.path,
            name: ROUTES.WORK_EXPERIENCE_SHARING.name,
            component: () => import("@/views/IndividualUser/WorkExperienceSharing.vue"),
            meta: { requiresAuth: false },
        },
        {
            path: ROUTES.WORK_EXPERIENCE_REGISTRATION.path,
            name: ROUTES.WORK_EXPERIENCE_REGISTRATION.name,
            component: () => import("@/views/IndividualUser/WorkExperienceRegistration.vue"),
            meta: { requiresAuth: true, allowedUserTypes: USER_TYPES.INDIVIDUAL_USER },
        },
        {
            path: ROUTES.MY_WORK_EXPERIENCE_DETAIL.path,
            name: ROUTES.MY_WORK_EXPERIENCE_DETAIL.name,
            component: () => import("@/views/IndividualUser/MyWorkExperienceDetail.vue"),
            meta: { requiresAuth: true, allowedUserTypes: USER_TYPES.INDIVIDUAL_USER },
        },
        {
            path: ROUTES.MY_WORK_EXPERIENCE_PAGE.path,
            name: ROUTES.MY_WORK_EXPERIENCE_PAGE.name,
            component: () => import("@/views/IndividualUser/MyWorkExperiencePage.vue"),
            meta: { requiresAuth: false }, // 모든 사용자 접근 가능
        },
        {
            path: ROUTES.WORK_EXPERIENCE_SHARING_DETAIL.path,
            name: ROUTES.WORK_EXPERIENCE_SHARING_DETAIL.name,
            component: () => import("@/views/IndividualUser/WorkExperienceSharingDetail.vue"),
            meta: { requiresAuth: true, allowedUserTypes: USER_TYPES.INDIVIDUAL_USER },

        },
        {
            path: ROUTES.DELETED_USER_REDIRECT.path,
            name: ROUTES.DELETED_USER_REDIRECT.name,
            component: () => import("@/views/Authentication/DeletedUserRedirectView.vue"),
            meta: { requiresAuth: false }, // 모든 사용자 접근 가능
        },
        {
            path: ROUTES.INDIVIDUAL_USER_MANAGEMENT.path,
            name: ROUTES.INDIVIDUAL_USER_MANAGEMENT.name,
            component: () => import("@/views/Admin/IndividualUserManagement.vue"),
            meta: { requiresAuth: true, allowedUserTypes: USER_TYPES.SERVICE_ADMIN },
        },
        {
            path: ROUTES.CORPORATE_USER_SIGNUP.path,
            name: ROUTES.CORPORATE_USER_SIGNUP.name,
            component: () => import("@/views/Admin/CorporateUserSignup.vue"),
            meta: { requiresAuth: true, allowedUserTypes: USER_TYPES.SERVICE_ADMIN },
        },
        {
            path: ROUTES.CORPORATE_USER_WITHDRAWAL.path,
            name: ROUTES.CORPORATE_USER_WITHDRAWAL.name,
            component: () => import("@/views/Admin/CorporateUserWithdrawal.vue"),
            meta: { requiresAuth: true, allowedUserTypes: USER_TYPES.SERVICE_ADMIN },
        },
        {
            path: ROUTES.CORPORATE_USERS.path,
            name: ROUTES.CORPORATE_USERS.name,
            component: () => import("@/views/Admin/CorporateUsersManagement.vue"),
            meta: { requiresAuth: true, allowedUserTypes: USER_TYPES.SERVICE_ADMIN },
        },
        {
            path: ROUTES.CORPORATE_JOB_POSTING_MANAGEMENT.path,
            name: ROUTES.CORPORATE_JOB_POSTING_MANAGEMENT.name,
            component: () => import("@/views/Admin/CorporateJobPostingManagement.vue"),
            meta: { requiresAuth: true, allowedUserTypes: USER_TYPES.SERVICE_ADMIN },
        },
        {
            path: ROUTES.ADMIN_CORPORATE_JOB_POSTING_DETAIL.path,
            name: ROUTES.ADMIN_CORPORATE_JOB_POSTING_DETAIL.name,
            component: () => import("@/views/Admin/AdminCorporateJobPostingDetail.vue"),
            meta: { requiresAuth: true, allowedUserTypes: USER_TYPES.SERVICE_ADMIN },
        },
        {
            path: ROUTES.ADMIN_JOB_POSTING_DETAIL.path,
            name: ROUTES.ADMIN_JOB_POSTING_DETAIL.name,
            component: () => import("@/views/CorporateUser/CorporateUserJobPostingDetail.vue"),
            meta: { requiresAuth: true, allowedUserTypes: [USER_TYPES.CORPORATE_MEMBER, USER_TYPES.SERVICE_ADMIN] },
        },
        {
            path: ROUTES.WORK_EXPERIENCE_MANAGEMENT.path,
            name: ROUTES.WORK_EXPERIENCE_MANAGEMENT.name,
            component: () => import("@/views/Admin/WorkExperienceManagement.vue"),
            meta: { requiresAuth: true, allowedUserTypes: USER_TYPES.SERVICE_ADMIN },
        },
        {
            path: ROUTES.WORK_EXPERIENCE_MANAGEMENT_DETAIL.path,
            name: ROUTES.WORK_EXPERIENCE_MANAGEMENT_DETAIL.name,
            component: () => import("@/views/Admin/WorkExperienceManagementDetail.vue"),
            meta: { requiresAuth: true, allowedUserTypes: USER_TYPES.SERVICE_ADMIN },
        },
        {
            path: ROUTES.USER_LOG_ANALYSIS.path,
            name: ROUTES.USER_LOG_ANALYSIS.name,
            component: () => import("@/views/Admin/UserLogAnalysis.vue"),
            meta: { requiresAuth: true, allowedUserTypes: USER_TYPES.SERVICE_ADMIN },
        },
        {
            path: ROUTES.CORPORATE_USER_PROFILE_READONLY.path,
            name: ROUTES.CORPORATE_USER_PROFILE_READONLY.name,
            component: () => import("@/views/Admin/CorporateUserProfileReadonly.vue"),
            meta: { requiresAuth: true, allowedUserTypes: USER_TYPES.SERVICE_ADMIN },
        },
        {
            path: ROUTES.PREMIUM_PACKAGE.path,
            name: ROUTES.PREMIUM_PACKAGE.name,
            component: () => import("@/views/CorporateUser/PremiumPackageView.vue"),
            meta: { requiresAuth: true, allowedUserTypes: USER_TYPES.CORPORATE_MEMBER },
        },
        {
            path: ROUTES.PAYMENT_MANAGEMENT.path,
            name: ROUTES.PAYMENT_MANAGEMENT.name,
            component: () => import("@/views/CorporateUser/PaymentManagementView.vue"),
            meta: { requiresAuth: true, allowedUserTypes: USER_TYPES.CORPORATE_MEMBER },
        },
        {
            path: ROUTES.LOG_DASH_BOARD_MANAGEMENT.path,
            name: ROUTES.LOG_DASH_BOARD_MANAGEMENT.name,
            component: () => import("@/views/Admin/LogDashboardManagement.vue"),
            meta: { requiresAuth: true, allowedUserTypes: USER_TYPES.INFRA_ADMIN },
        },
    ],
});

router.beforeEach((to, from, next) => {
    // Access Token 처리
    if (window.location.hash.includes('accessToken=')) {
        const token = window.location.hash.split('accessToken=')[1];
        if (token) {
            localStorage.setItem('accessToken', "Bearer " + token);
            decodeToken();
            router.replace({ path: to.path });
            window.location.hash = '';
        }
    }

    const userStore = useUserStore();
    const loginModalStore = useLoginModalStore();
    const isAuthenticated = userStore.isAuthenticated;
    const currentUserType = userStore.getCurrentUserType;
    const allowedUserTypes = to.meta.allowedUserTypes;
    const isRequiresAuth = to.meta.requiresAuth;

    if (isRequiresAuth) {
        // 로그인 x
        if (!isAuthenticated) {
            if (allowedUserTypes && allowedUserTypes.includes(USER_TYPES.INFRA_ADMIN) || allowedUserTypes.includes(USER_TYPES.SERVICE_ADMIN)) {
                // 권한 타입이 관리자 경우 관리자 로그인 페이지로 리다이렉트
                return loginModalStore.openModal(ROUTES.ADMIN_LOGIN.name);
            }
            // 권한탄입이 개인유저, 기업유저 경우 일반 로그인 페이지로 리다이렉트
            return loginModalStore.openModal(ROUTES.LOGIN.name);
        }

        // 로그인 o
        if (allowedUserTypes && !allowedUserTypes.includes(currentUserType)) {
            // 권한 타입이 존재하지 않는 경우 메인 페이지로 리다이렉트
            return loginModalStore.openModal(ROUTES.LOGIN.name);
        }
    }

    // 로그인한 관리자 사용자의 메인 페이지 리다이렉션
    if (isAuthenticated && (currentUserType === USER_TYPES.INFRA_ADMIN || currentUserType === USER_TYPES.SERVICE_ADMIN)) {
        if (to.path === ROUTES.MAIN.path) {
            return next({ path: ROUTES.ADMIN_MAIN.path });
        }
    }

    // NotFound로 가는 경우는 리다이렉션 하지 않음
    if (to.name === 'NotFound') {
        return next();
    }

    next();
});

export default router;
