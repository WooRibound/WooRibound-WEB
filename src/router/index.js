import { createRouter, createWebHistory } from "vue-router";
import { ROUTES } from "@/router/routes";
import { useUserStore } from "@/stores/userStore";
import { USER_TYPES } from "@/constants/userTypes";

const router = createRouter({
    history: createWebHistory(""),
    routes: [
        {
            path: "/:pathMatch(.*)*",
            name: "NotFound",
            component: () => import("@/views/Error/NotFindPageView.vue"),
        },
        {
            path: ROUTES.MAIN.path,
            name: ROUTES.MAIN.name,
            component: () => import("@/views/Common/MainView.vue"),
        },
        {
            path: ROUTES.ADMIN_MAIN.path,
            name: ROUTES.ADMIN_MAIN.name,
            component: () => import("@/views/Common/AdminMain.vue"),
        },
        {
            path: ROUTES.NOTIFICATION_PAGE.path,
            name: ROUTES.NOTIFICATION_PAGE.name,
            component: () => import("@/views/IndividualUser/NotificationPage.vue"),
        },
        {
            path: ROUTES.JOB_MENU.path,
            name: ROUTES.JOB_MENU.name,
            component: () => import("@/views/IndividualUser/JobMenu.vue"),
        },
        {
            path: ROUTES.JOB_APPLICATION_STATUS.path,
            name:  ROUTES.JOB_APPLICATION_STATUS.name,
            component: () => import("@/views/IndividualUser/JobApplicationStatus.vue"),
        },
        {
            path: ROUTES.RESUME_PAGE.path,
            name: ROUTES.RESUME_PAGE.name,
            component: () => import("@/views/IndividualUser/ResumePage.vue"),
        },
        {
            path: ROUTES.INDIVIDUAL_USER_PROFILE.path,
            name: ROUTES.INDIVIDUAL_USER_PROFILE.name,
            component: () => import("@/views/IndividualUser/IndividualUserProfile.vue"),
        },
        {
            path: ROUTES.WOORIBOUND_ELEVATION_INFO.path,
            name: ROUTES.WOORIBOUND_ELEVATION_INFO.name,
            component: () => import("@/views/IndividualUser/WooriboundElevationInfo.vue"),
        },
        {
            path: ROUTES.JOB_POSTINGS_PAGE.path,
            name: ROUTES.JOB_POSTINGS_PAGE.name,
            component: () => import("@/views/IndividualUser/JobPostingsPage.vue"),
        },
        {
            path: ROUTES.LOGIN.path,
            name: ROUTES.LOGIN.name,
            component: () => import("@/views/Authentication/LoginView.vue"),
        },
        {
            path: ROUTES.ADMIN_LOGIN.path,
            name: ROUTES.ADMIN_LOGIN.name,
            component: () => import("@/views/Authentication/AdminLoginView.vue"),
        },
        {
            path: ROUTES.INDIVIDUAL_USER_REGISTER.path,
            name: ROUTES.INDIVIDUAL_USER_REGISTER.name,
            component: () => import("@/views/Authentication/IndividualUserRegisterView.vue"),
        },
        {
            path: ROUTES.CORPORATE_USER_REGISTER.path,
            name: ROUTES.CORPORATE_USER_REGISTER.name,
            component: () => import("@/views/Authentication/CorporateUserRegisterView.vue"),
        },
        {
            path: ROUTES.CORPORATE_USER_FIND_PASSWORD.path,
            name: ROUTES.CORPORATE_USER_FIND_PASSWORD.name,
            component: () => import("@/views/Authentication/CorporateUserFindPasswordView.vue"),
        },
        {
            path: ROUTES.JOB_POSTING_DETAIL.path,
            name: ROUTES.JOB_POSTING_DETAIL.name,
            component: () => import("@/views/IndividualUser/JobPostingDetail.vue"),
        },
        {
            path: ROUTES.INDIVIDUAL_USER_DELETE.path,
            name: ROUTES.INDIVIDUAL_USER_DELETE.name,
            component: () => import("@/views/IndividualUser/IndividualUserDelete.vue"),
        },
        {
            path: ROUTES.CORPORATE_USER_DELETE.path,
            name: ROUTES.CORPORATE_USER_DELETE.name,
            component: () => import("@/views/CorporateUser/CorporateUserDelete.vue"),
        },
        {
            path: ROUTES.DELETE_SUCCESS.path,
            name: ROUTES.DELETE_SUCCESS.name,
            component: () => import("@/views/Common/UserDeleteSuccess.vue"),
        },
        {
            path: ROUTES.CORPORATE_DELETE_SUCCESS.path,
            name: ROUTES.CORPORATE_DELETE_SUCCESS.name,
            component: () => import("@/views/Common/CorporateDeleteSuccess.vue"),
        },
        {
            path: ROUTES.CORPORATE_USER_ACCOUNT_MENU.path,
            name: ROUTES.CORPORATE_USER_ACCOUNT_MENU.name,
            component: () => import("@/views/CorporateUser/CorporateUserAccountMenu.vue"),
        },
        {
            path: ROUTES.CORPORATE_USER_PROFILE.path,
            name: ROUTES.CORPORATE_USER_PROFILE.name,
            component: () => import("@/views/CorporateUser/CorporateUserProfile.vue"),
        },
        {
            path: ROUTES.JOB_POSTING_MANAGEMENT.path,
            name: ROUTES.JOB_POSTING_MANAGEMENT.name,
            component: () => import("@/views/CorporateUser/JobPostingManagement.vue"),
        },
        {
            path: ROUTES.JOB_POSTING_REGISTER.path,
            name: ROUTES.JOB_POSTING_REGISTER.name,
            component: () => import("@/views/CorporateUser/JobPostingRegister.vue"),
        },
        {
            path: ROUTES.CORPORATE_USER_JOB_POSTING_DETAIL.path,
            name: ROUTES.CORPORATE_USER_JOB_POSTING_DETAIL.name,
            component: () => import("@/views/CorporateUser/CorporateUserJobPostingDetail.vue"),
        },
        {
            path: ROUTES.APPLICANT_DETAIL_PAGE.path,
            name: ROUTES.APPLICANT_DETAIL_PAGE.name,
            component: () => import("@/views/CorporateUser/ApplicantDetailPage.vue"),
        },
        {
            path: ROUTES.READONLY_RESUME_PAGE.path,
            name: ROUTES.READONLY_RESUME_PAGE.name,
            component: () => import("@/views/CorporateUser/ReadonlyResumePage.vue"),
        },
        {
            path: ROUTES.EMPLOYEE_MANAGEMENT.path,
            name: ROUTES.EMPLOYEE_MANAGEMENT.name,
            component: () => import("@/views/CorporateUser/EmployeeManagement.vue"),
        },
        {
            path: ROUTES.WISDOM_SHARE.path,
            name: ROUTES.WISDOM_SHARE.name,
            component: () => import("@/views/IndividualUser/WisdomShare.vue"),
        },
        {
            path: ROUTES.WISDOM_SHARE_REGISTER.path,
            name: ROUTES.WISDOM_SHARE_REGISTER.name,
            component: () => import("@/views/IndividualUser/WisdomShareRegister.vue"),
        },
        {
            path: ROUTES.WISDOM_SHARE_DELETE.path,
            name: ROUTES.WISDOM_SHARE_DELETE.name,
            component: () => import("@/views/IndividualUser/WisdomShareDelete.vue"),
        },
        {
            path: ROUTES.WISDOM_EXPLORE.path,
            name: ROUTES.WISDOM_EXPLORE.name,
            component: () => import("@/views/IndividualUser/WisdomExplore.vue"),
        },
        {
            path: ROUTES.WISDOM_EXPLORE_DETAIL.path,
            name: ROUTES.WISDOM_EXPLORE_DETAIL.name,
            component: () => import("@/views/IndividualUser/WisdomExploreDetail.vue"),
        },
        {
            path: ROUTES.DELETED_USER_REDIRECT.path,
            name: ROUTES.DELETED_USER_REDIRECT.name,
            component: () => import("@/views/Authentication/DeletedUserRedirectView.vue")
        },
        {
            path: ROUTES.INDIVIDUAL_USER_MANAGEMENT.path,
            name: ROUTES.INDIVIDUAL_USER_MANAGEMENT.name,
            component: () => import("@/views/Admin/IndividualUserManagement.vue"),
        },
        {
            path: ROUTES.CORPORATE_USER_SIGNUP.path,
            name: ROUTES.CORPORATE_USER_SIGNUP.name,
            component: () => import("@/views/Admin/CorporateUserSignup.vue"),
        },
        {
            path: ROUTES.CORPORATE_USER_WITHDRAWAL.path,
            name: ROUTES.CORPORATE_USER_WITHDRAWAL.name,
            component: () => import("@/views/Admin/CorporateUserWithdrawal.vue"),
        },
        {
            path: ROUTES.CORPORATE_USERS.path,
            name: ROUTES.CORPORATE_USERS.name,
            component: () => import("@/views/Admin/CorporateUsersManagement.vue"),
        },
        {
            path: ROUTES.CORPORATE_JOB_POSTING_MANAGEMENT.path,
            name: ROUTES.CORPORATE_JOB_POSTING_MANAGEMENT.name,
            component: () => import("@/views/Admin/CorporateJobPostingManagement.vue"),
        },
        {
            path: ROUTES.ADMIN_JOB_POSTING_DETAIL.path,
            name: ROUTES.ADMIN_JOB_POSTING_DETAIL.name,
            component: () => import("@/views/CorporateUser/CorporateUserJobPostingDetail.vue"),
        },
        {
            path: ROUTES.WISDOM_MANAGEMENT.path,
            name: ROUTES.WISDOM_MANAGEMENT.name,
            component: () => import("@/views/Admin/WisdomManagement.vue"),
        },
        {
            path: ROUTES.USER_LOG_ANALYSIS.path,
            name: ROUTES.USER_LOG_ANALYSIS.name,
            component: () => import("@/views/Admin/UserLogAnalysis.vue"),
        },
        {
            path: ROUTES.LOG_DASH_BOARD_MANAGEMENT.path,
            name: ROUTES.LOG_DASH_BOARD_MANAGEMENT.name,
            component: () => import("@/views/Admin/LogDashboardManagement.vue"),
        },
        {
            path: ROUTES.CORPORATE_USER_PROFILE_READONLY.path,
            name: ROUTES.CORPORATE_USER_PROFILE_READONLY.name,
            component: () => import("@/views/Admin/CorporateUserProfileReadonly.vue"),
        },
    ],
});

router.beforeEach((to, from, next) => {
    // Access Token 처리
    if (window.location.hash.includes('accessToken=')) {
        const token = window.location.hash.split('accessToken=')[1];
        if (token) {
            localStorage.setItem('accessToken', "bearer "+token);
            window.location.hash = '';
        }
    }

    const userStore = useUserStore();

    // 로그인한 관리자 사용자의 메인 페이지 리다이렉션
    if (userStore.isLoggedIn &&
        (userStore.userType === USER_TYPES.INFRA_ADMIN || userStore.userType === USER_TYPES.SERVICE_ADMIN)) {
        if (to.path === ROUTES.MAIN.path) {
            return next({ path: ROUTES.ADMIN_MAIN.path });
        }
    }

    next();
});

export default router;
