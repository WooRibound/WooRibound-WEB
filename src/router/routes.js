export const ROUTES = {
    NOT_FOUND_PAGE: {
        path:"/:pathMatch(.*)*",
        name: "NotFoundPageView",
    },
    // [개인회원, 기업회원] 메인
    MAIN: {
        path: "/",
        name: "Main",
    },
    // [개인회원, 기업회원] 로그인
    LOGIN: {
        path: "/login",
        name: "Login",
    },
    // [개인회원] 회원가입
    INDIVIDUAL_USER_REGISTER: {
        path: "/individual-user/register",
        name: "IndividualUserRegister",
    },
    // [서비스관리자, 인프라관리자] 메인
    ADMIN_MAIN: {
        path: "/admin",
        name: "AdminMain",
    },
    // [관리자] 관리자 로그인
    ADMIN_LOGIN: {
        path: "/admin/login",
        name: "AdminLogin"
    },
    // [기업회원] 회원가입
    CORPORATE_USER_REGISTER: {
        path: "/corporate-user/register",
        name: "CorporateResister",
    },
    // [개인회원] 알림 메세지
    NOTIFICATION_PAGE: {
        path: "/individual-user/notification",
        name: "NotificationPage",
    },
    // [개인회원] 지원 현황
    JOB_APPLICATION_STATUS: {
        path: "/individual-user/jobs/application-status",
        name: "JobApplicationStatus",
    },
    // [개인회원] 지원 현황 상세
    JOB_APPLICATION_STATUS_DETAIL: {
        path: "/individual-user/jobs/application-status/detail/:postId/:applyId",
        name: "JobApplicationStatusDetail",
    },
    // [개인회원] 이력서
    RESUME_PAGE: {
        path: "/individual-user/resume/:id?",
        name: "ResumePage",
    },
    // [개인회원] 개인 정보
    INDIVIDUAL_USER_PROFILE: {
        path: "/individual-user/profile",
        name: "IndividualUserProfile",
    },
    // [개인회원] 우바고도
    WOORIBOUND_ELEVATION_INFO: {
        path: "/individual-user/wooribound-elevation",
        name: "WooriboundElevationInfo",
    },
    // [개인회원] 채용공고
    JOB_POSTINGS_PAGE: {
        path: "/individual-user/job-postings/:viewType",
        name: "JobPostingsPage",
    },
    // [기업회원] 비밀번호 찾기
    CORPORATE_USER_FIND_PASSWORD: {
        path: "/corporate/find-password",
        name: "CorporateFindPassword",
    },
    // [개인회원] 채용공고 상세페이지
    JOB_POSTING_DETAIL: {
        path: "/individual-user/job-posting/:postId?",
        name: "JobPostingDetail",
    },
    // [개인회원] 탈퇴하기
    INDIVIDUAL_USER_DELETE: {
        path: "/individual-user/delete",
        name: "IndividualUserDelete",
    },
    // [기업회원] 탈퇴하기
    CORPORATE_USER_DELETE: {
        path: "/corporate-user/delete",
        name: "CorporateUserDelete",
    },
    // [개인회원, 기업회원] 탈퇴성공
    DELETE_SUCCESS: {
        path: "/delete-success/:cat",
        name: "DeleteSuccess",
    },
    CORPORATE_DELETE_SUCCESS: {
        path: "/corporate-delete-success",
        name: "CorporateDeleteSuccess",
    },
    // [기업회원] 기업정보 메뉴
    CORPORATE_USER_ACCOUNT_MENU: {
        path: "/corporate/account",
        name: "CorporateUserAccountMenu",
    },
    // [기업회원] 기업정보 수정
    CORPORATE_USER_PROFILE: {
        path: "/corporate-user/profile",
        name: "CorporateUserProfile",
    },
    // [기업회원] 공고 관리
    JOB_POSTING_MANAGEMENT: {
        path: "/job-posting/management",
        name: "JobPostingManagement"
    },
    // [기업회원] 공고 등록
    JOB_POSTING_REGISTER: {
        path: "/job-posting/register",
        name: "JobPostingRegister"
    },
    // [개인회원] 공고 상세페이지
    CORPORATE_USER_JOB_POSTING_DETAIL: {
        path: "/corporate-user/job-posting/:postId/:viewType?",
        name: "CorporateUserJobPostingDetail",
    },
    // [기업회원] 공고 지원자
    APPLICANT_DETAIL_PAGE: {
        path: "/job-posting/applicants/:id",
        name: "ApplicantDetailPage"
    },
    // [기업회원] 공고 추천 지원자
    APPLICANT_RECOMMEND_PAGE: {
        path: "/job-posting/applicants/recommend/:jobId/:postId",
        name: "ApplicantRecommendPage"
    },
    // [기업회원] 추천 지원자 프리미엄
    RECOMMEND_PREMIUM_PAGE: {
        path: "/job-posting/applicants/recommend/premium/:userId",
        name: "RecommendPremiumPage"
    },
    // [기업회원] 이력서 보기
    READONLY_RESUME_PAGE: {
        path: "/corporate-user/resume/:id?",
        name: "ReadonlyResumePage"
    },
    // [기업회원] 직원 관리
    EMPLOYEE_MANAGEMENT: {
        path: "/employee-management",
        name: "EmployeeManagement"
    },
    // [기업회원] 프리미엄 패키지
    PREMIUM_PACKAGE: {
        path: "/premium-package",
        name: "PremiumPackageView"
    },
    // [기업회원] 결제 관리
    PAYMENT_MANAGEMENT: {
        path: "/payment-management",
        name: "PaymentManagementView"
    },
    // [개인회원] 일경험 공유하기
    WORK_EXPERIENCE_SHARING: {
        path: "/work-experience",
        name: "WorkExperienceSharing"
    },
    // [개인회원] 일경험 등록
    WORK_EXPERIENCE_REGISTRATION: {
        path: "/work-experience/registration",
        name: "WorkExperienceRegistration"
    },
    // [개인회원] 일경험 상세보기
    WORK_EXPERIENCE_SHARING_DETAIL: {
        path: "/work-experience/:id",
        name: "WorkExperienceSharingDetail"
    },
    // [개인회원] 내가 쓴 일경험
    MY_WORK_EXPERIENCE_PAGE: {
        path: "/my-work-experience",
        name: "MyWorkExperiencePage"
    },
    // [개인회원] 내가 쓴 일경험 상세
    MY_WORK_EXPERIENCE_DETAIL: {
        path: "/my-work-experience/:id",
        name: "MyWorkExperienceDetail"
    },
    // [개인회원] 탈퇴한 아이디로 네이버 로그인 시도 시 리다이렉트 페이지
    DELETED_USER_REDIRECT: {
        path: "/deleted/user",
        name: "DeletedUserRedirect"
    },
    // [서비스 관리자] 개인 회원 관리
    INDIVIDUAL_USER_MANAGEMENT: {
        path: '/admin/user-management',
        name: 'IndividualUserManagement'
    },
    // [서비스 관리자] 기업 회원 가입
    CORPORATE_USER_SIGNUP: {
        path: '/admin/corporate-signup',
        name: 'CorporateUserSignup',
    },
    // [서비스 관리자] 기업 회원 탈퇴
    CORPORATE_USER_WITHDRAWAL: {
        path: '/admin/corporate-withdrawal',
        name: 'CorporateUserWithdrawal',
    },
    // [서비스 관리자] 기업 회원 조회
    CORPORATE_USERS: {
        path: '/admin/corporate-users',
        name: 'CorporateUsers',
    },
    // [서비스 관리자] 기업 공고 관리
    CORPORATE_JOB_POSTING_MANAGEMENT: {
        path: '/admin/corporate-job-posting-management',
        name: 'CorporateJobPostingManagement',
    },
    // [서비스 관리자] 기업 공고 관리 상세
    ADMIN_CORPORATE_JOB_POSTING_DETAIL: {
        path: '/admin/corporate-job-posting-management/detail/:postId',
        name: 'AdminCorporateJobPostingDetail',
    },
    // [서비스 관리자] 공고 상세페이지
    ADMIN_JOB_POSTING_DETAIL: {
        path: "/admin/corporate-job-posting-management/detail/:id",
        name: "AdminJobPostingDetail",
    },
    // [서비스 관리자] 일경험 공유 관리
    WORK_EXPERIENCE_MANAGEMENT: {
        path: '/admin/work-experience-management',
        name: 'WorkExperienceManagement',
    },
    // [서비스 관리자] 일경험 공유 관리 상세보기
    WORK_EXPERIENCE_MANAGEMENT_DETAIL: {
        path: '/admin/work-experience-management/:id',
        name: 'WorkExperienceManagementDetail',
    },
    // [서비스 관리자] 사용자 로그 분석
    USER_LOG_ANALYSIS: {
        path: '/admin/user-log-analysis',
        name: 'UserLogAnalysis',
    },
    // [서비스 관리자] 사용자 로그 분석
    LOG_DASH_BOARD_MANAGEMENT: {
        path: '/admin/log-dashboard-management',
        name: 'LogDashboardManagement',
    },
    // [서비스 관리자] 기업 회원 상세 조회
    CORPORATE_USER_PROFILE_READONLY: {
        path: '/admin/corporate-users/profile/:id',
        name: 'CorporateUserProfileReadonly',
    }
};
