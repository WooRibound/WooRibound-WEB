export const ROUTES = {
    // [개인회원, 기업회원] 메인
    MAIN: {
        path: "/",
        name: "Main",
    },
    // [서비스관리자, 인프라관리자] 메인
    ADMIN_MAIN: {
        path: "/admin",
        name: "AdminMain",
    },
    // [개인회원] 채용공고 메뉴 선택
    JOB_MENU: {
        path: "/jobs/menu",
        name: "JobMenu",
    },
    // [개인회원] 지원 현황
    JOB_APPLICATION_STATUS: {
        path: "/jobs/application-status",
        name: "JobApplicationStatus",
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
    // [기업회원] 회원가입
    CORPORATE_USER_REGISTER: {
        path: "/corporate-user/register",
        name: "CorporateResister",
    },
    // [개인회원] 우바고도
    WOORIBOUND_ELEVATION_INFO: {
        path: "/wooribound-elevation",
        name: "WooriboundElevationInfo",
    },
    // [개인회원] 채용공고
    JOB_POSTINGS_PAGE: {
        path: "/job-postings/:viewType",
        name: "JobPostingsPage",
    },
    // [기업회원] 비밀번호 찾기
    CORPORATE_USER_FIND_PASSWORD: {
        path: "/corporate/find-password",
        name: "CorporateFindPassword",
    },
    // [개인회원] 채용공고 상세페이지
    JOB_POSTING_DETAIL: {
        path: "/job-posting/:id",
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
    USER_DELETE_SUCCESS: {
        path: "/delete-success",
        name: "UserDeleteSuccess",
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
    // [기업회원] 공고 지원자
    APPLICANT_DETAIL_PAGE: {
        path: "/job-posting/applicants/:id",
        name: "ApplicantDetailPage"
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
    // [개인회원] 지혜 나눔
    WISDOM_SHARE: {
        path: "/wisdom/share",
        name: "WisdomShare"
    },
    // [개인회원] 지혜 나눔 등록
    WISDOM_SHARE_REGISTER: {
        path: "/wisdom/share/register",
        name: "WisdomShareRegister"
    },
    // [개인회원] 지혜 나눔 삭제
    WISDOM_SHARE_DELETE: {
        path: "/wisdom/share/delete/:id",
        name: "WisdomShareDelete"
    },
    // [개인회원] 지혜 탐색
    WISDOM_EXPLORE: {
        path: "/wisdom/explore",
        name: "WisdomExplore"
    },
    // [개인회원] 지혜 나눔 삭제
    WISDOM_EXPLORE_DETAIL: {
        path: "/wisdom/explore/:id",
        name: "WisdomExploreDetail"
    },
};
