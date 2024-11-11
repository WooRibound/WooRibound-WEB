<script>
import {computed} from "vue";
import { useUserStore } from "@/stores/userStore";
import { USER_TYPES } from "@/constants/userTypes";
import { useRouter } from "vue-router";
import {ROUTES} from "@/router/routes";
import { logout } from "@/api/services/authenticationService"

export default {
  name: "FullScreenMenu",
  computed: {
    ROUTES() {
      return ROUTES
    }
  },
  props: {
    fullScreenMenuState: {
      type: Boolean,
      required: true
    }
  },
  setup(props, { emit }) {
    const userStore = useUserStore();
    const router = useRouter();

    const isVisible = computed(() => props.fullScreenMenuState);
    const loginText = computed(() => (userStore.isLoggedIn ? "로그아웃" : "로그인"));

    const onCloseFullScreenMenuClick = () => {
      emit('close-menu');
    }

    const onClickMoveLogin = () => {
      if (!userStore.isLoggedIn) {
        onCloseFullScreenMenuClick();
        router.push("/login");
      } else {
        logout();
        console.log("로그아웃");
      }
    }

    return {
      isVisible,
      loginText,
      onCloseFullScreenMenuClick,
      onClickMoveLogin,
      userStore,
      USER_TYPES,
    };
  }
}
</script>

<template>
  <div v-if="isVisible">
    <header class="header">
      <img src="../../assets/images/icons/home.png" class="home-image">
      <img src="../../assets/images/icons/close.png" class="close-icon" @click="onCloseFullScreenMenuClick">
    </header>
    <div class="top-bar">
      <div class="login-text" @click="onClickMoveLogin">{{ loginText }}</div>
      <img src="../../assets/images/logo/wooribound_logo.png" class="logo-image">
    </div>
    <div class="navigation-menu" v-if="userStore.userType === USER_TYPES.INDIVIDUAL_USER">
      <div class="menu-content">
        <router-link :to="ROUTES.JOB_MENU.path">
          <div class="menu_title" @click="onCloseFullScreenMenuClick">채용 공고</div>
        </router-link>
      </div>
      <div class="menu-content">
        <div class="menu_title">내 정보 보기</div>
        <div class="menu-items" @click="onCloseFullScreenMenuClick">
          <router-link :to="ROUTES.JOB_APPLICATION_STATUS.path">
            <div class="menu-item">지원 현황</div>
          </router-link>
          <router-link :to="ROUTES.RESUME_PAGE.path">
            <div class="menu-item">이력서</div>
          </router-link>
          <router-link :to="ROUTES.INDIVIDUAL_USER_PROFILE.path">
            <div class="menu-item">개인 정보</div>
          </router-link>
          <router-link :to="ROUTES.WOORIBOUND_ELEVATION_INFO.path">
            <div class="menu-item">우바 고도</div>
          </router-link>
        </div>
      </div>
      <div class="menu-content">
        <div class="menu_title">지혜 마당</div>
        <div class="menu-items" @click="onCloseFullScreenMenuClick">
          <router-link :to="ROUTES.WISDOM_SHARE.path">
            <div class="menu-item">지혜 나눔</div>
          </router-link>
          <router-link :to="ROUTES.WISDOM_EXPLORE.path">
            <div class="menu-item">지혜 탐색</div>
          </router-link>
        </div>
      </div>
    </div>
    <div class="navigation-menu" v-if="userStore.userType === USER_TYPES.CORPORATE_MEMBER">
      <div class="menu-content">
        <div class="menu_title">내 정보 보기</div>
        <div class="menu-items" @click="onCloseFullScreenMenuClick">
          <router-link :to="ROUTES.CORPORATE_USER_ACCOUNT_MENU.path">
            <div class="menu-item">기업 정보</div>
          </router-link>
        </div>
      </div>
      <div class="menu-content">
        <router-link :to="ROUTES.JOB_POSTING_MANAGEMENT.path">
          <div class="menu_title" @click="onCloseFullScreenMenuClick">공고 관리</div>
        </router-link>
      </div>
      <div class="menu-content">
        <router-link :to="ROUTES.EMPLOYEE_MANAGEMENT.path">
          <div class="menu_title" @click="onCloseFullScreenMenuClick">직원 관리</div>
        </router-link>
      </div>
    </div>
    <div class="navigation-menu" v-if="userStore.userType === USER_TYPES.SERVICE_ADMIN">
      <div class="menu-content">
        <router-link :to="ROUTES.INDIVIDUAL_USER_MANAGEMENT.path">
          <div class="menu_title" @click="onCloseFullScreenMenuClick">개인 회원 관리</div>
        </router-link>
      </div>
      <div class="menu-content">
        <div class="menu_title">기업 회원 관리</div>
        <div class="menu-items" @click="onCloseFullScreenMenuClick">
          <router-link :to="ROUTES.CORPORATE_USER_SIGNUP.path">
            <div class="menu-item">기업 가입</div>
          </router-link>
          <router-link :to="ROUTES.CORPORATE_USER_WITHDRAWAL.path">
            <div class="menu-item">기업 탈퇴</div>
          </router-link>
          <router-link :to="ROUTES.CORPORATE_USERS.path">
           <div class="menu-item">기업 회원 조회</div>
          </router-link>
          <router-link :to="ROUTES.CORPORATE_JOB_POSTING_MANAGEMENT.path">
            <div class="menu-item">공고 관리</div>
          </router-link>
        </div>
      </div>
      <div class="menu-content">
        <router-link :to="ROUTES.WISDOM_MANAGEMENT.path">
          <div class="menu_title" @click="onCloseFullScreenMenuClick">지혜 마당 관리</div>
        </router-link>
      </div>
      <div class="menu-content">
        <router-link :to="ROUTES.USER_LOG_ANALYSIS.path">
          <div class="menu_title" @click="onCloseFullScreenMenuClick">사용자 로그 분석</div>
        </router-link>
      </div>
    </div>
    <div class="navigation-menu" v-if="userStore.userType === USER_TYPES.INFRA_ADMIN">
      <div class="menu-content">
        <router-link :to="ROUTES.LOG_DASH_BOARD_MANAGEMENT.path">
          <div class="menu_title" @click="onCloseFullScreenMenuClick">로그 대시보드 관리</div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between; /* 양 끝에 배치 */
  align-items: center;            /* 수직 가운데 정렬 */
  background-color: #ffffff;      /* 배경 흰색 */
  padding: 0 10px;                /* 좌우 10px 패딩 */
  height: 60px;                   /* 일반적인 헤더 높이 */
  //box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.home-image {
  width: 40px;
  cursor: pointer;
}

.close-icon {
  width: 30px;                    /* 버튼 크기 설정 */
  cursor: pointer;
}

.top-bar {
  display: flex;
  flex-direction: column;         /* 세로 방향 정렬 */
  align-items: flex-start;        /* 수평 시작 정렬 */
  margin: 30px 0;                /* 상하 여백 */
}

.login-text {
  background-color: #ffffff;      /* 배경 흰색 */
  border: 1px solid #413F42;      /* 테두리 색상 */
  border-radius: 5px;            /* 둥근 꼭지점 */
  padding: 10px 110px;            /* 내부 여백 */
  font-size: 18px;                /* 글자 크기 설정 (조정 가능) */
  color: #413F42;                 /* 글자 색상 */
  margin-bottom: 50px;            /* 로고와의 간격 */
  margin-left: auto;
  margin-right: auto;
  font-size: 10pt;
  font-weight: bold;
}

.logo-image {
  width: 120px;                   /* 로고 이미지 크기 설정 */
  margin-left: 10px;              /* 화면 끝에서 10px 간격 */
}

.menu-content {
  background-color: #fff;
  padding: 20px;
  width: 100%; /* 화면 사이즈에 따라 90%의 너비 사용 */
  height: 50%; /* 높이를 화면의 반으로 설정 */
  margin-bottom: 0; /* 아래쪽 여백 제거 */
  border-top: 1px solid rgba(65, 63, 66, 0.5); /* 상단 선 색상 연하게 설정 */
  position: relative; /* 자식 요소의 위치를 상대적으로 설정 */
}

.menu-content:last-child {
  border-bottom: none; /* 마지막 요소의 하단 선 제거 */
}

.menu_title {
  font-weight: bold; /* 굵은 글씨체 */
  font-size: 24px; /* 폰트 크기 설정 (조정 가능) */
}

.menu-items {
  margin-top: 15px; /* 메뉴 제목과 메뉴 항목 사이의 여백 */
  font-size: 19px;
}

.menu-item {
  padding: 10px 0; /* 항목의 상하 여백 */
  cursor: pointer; /* 마우스 포인터가 아이템에 올 때 손가락 모양으로 변경 */
}

.menu-item:last-child {
  border-bottom: none; /* 마지막 항목의 구분선 제거 */
}
</style>