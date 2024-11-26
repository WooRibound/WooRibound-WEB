<script>
import { ref } from 'vue';
import { USER_TYPES } from "@/constants/userTypes";
import { useRouter } from "vue-router";
import { ROUTES } from "@/router/routes";
import { corporateLogin } from "@/api/services/authenticationService";

export default {
  name: "LoginView",
  setup() {
    const router = useRouter();

    const activeUserType = ref(USER_TYPES.INDIVIDUAL_USER); // 기본값: 개인 회원

    // 추가된 ref들
    const username = ref('');
    const password = ref('');
    const errorMessage = ref('');

    const onSetActiveUserTypeClick = (type) => {
      activeUserType.value = type;
    };

    const onIndividualUserLoginClick = () => {
      console.log("개인회원 로그인 하기");

      const baseURL = process.env.VUE_APP_OAUTH_URL; // 환경변수에서 baseURL을 가져옵니다.

      // 네이버 OAuth 경로로 리다이렉트
      window.location.href = baseURL + "/oauth2/authorization/naver"; // 네이버 로그인 요청 URL
    }
    const onCorporateUserLoginClick = async () => {
      // 입력값 검증
      if (!username.value || !password.value) {
        errorMessage.value = '아이디와 비밀번호를 모두 입력해주세요.';
        return;
      }

      try {
        errorMessage.value = ''; // 이전 에러메시지 초기화

        // 로그인 API 호출
        await corporateLogin(username.value, password.value);

        // 로그인 성공 시 메인 페이지로 이동
        router.push(ROUTES.MAIN.path);
      } catch (error) {
        console.error('로그인 실패:', error);
        errorMessage.value = '아이디 또는 비밀번호가 올바르지 않습니다.';
      }
    }
    

    return {
      activeUserType,
      username,
      password,
      errorMessage,
      onSetActiveUserTypeClick,
      onIndividualUserLoginClick,
      onCorporateUserLoginClick,
      USER_TYPES,
      ROUTES
    };
  }
}
</script>

<template>
  <main class="body">
    <div class="header">로그인</div>
    <div class="content">
      <div class="user-type-selection">
        <div
            class="user-type"
            :class="{ active: activeUserType === USER_TYPES.INDIVIDUAL_USER, selected: activeUserType === USER_TYPES.INDIVIDUAL_USER }"
            @click="onSetActiveUserTypeClick(USER_TYPES.INDIVIDUAL_USER)">
          개인 회원
        </div>
        <div
            class="user-type"
            :class="{ active: activeUserType === USER_TYPES.CORPORATE_MEMBER, selected: activeUserType === USER_TYPES.CORPORATE_MEMBER }"
            @click="onSetActiveUserTypeClick(USER_TYPES.CORPORATE_MEMBER)">
          기업 회원
        </div>
      </div>
      <img src="@/assets/images/logo/wooribound_logo.png" class="wooribound-logo" v-if="false">
      <div class="input-section" v-if="activeUserType === USER_TYPES.INDIVIDUAL_USER">
        <p class="login-guide">네이버 아이디로 간편하게 시작하기</p>
        <div class="login-type" @click="onIndividualUserLoginClick">
          <img src="@/assets/images/icons/naver_login.png" class="naver-logo" alt="네이버 로그인">
        </div>
        <p class="login-benefit">• 네이버 로그인으로 간편하게 우리바운드를 <br> 이용해보세요</p>
      </div>
      <div class="input-section" v-if="activeUserType === USER_TYPES.CORPORATE_MEMBER">
        <input
            class="input-field"
            placeholder="아이디"
            v-model="username"
            @keyup.enter="onCorporateUserLoginClick">
        <input
            class="input-field"
            placeholder="비밀번호"
            type="password"
            v-model="password"
            @keyup.enter="onCorporateUserLoginClick">
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <div class="delete-button" @click="onCorporateUserLoginClick">로그인</div>
        <router-link :to="ROUTES.CORPORATE_USER_FIND_PASSWORD.path" class="forgot-password">
          비밀번호 찾기
        </router-link>
        <router-link :to="ROUTES.CORPORATE_USER_REGISTER.path" class="signup-link">
          회원가입 하기
        </router-link>
      </div>
    </div>
  </main>
</template>

<style scoped>
.body {
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f8f9fa;
  overflow-y: auto;
}

.header {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 50px;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between; /* 콘텐츠와 요소를 공간을 균등하게 분배 */
}

.user-type-selection {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  width: 250px;
  gap: 40px; /* 두 요소 사이의 간격을 10px로 설정 */
}

.user-type {
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  position: relative; /* 아래 선을 위한 위치 설정 */
  color: #000; /* 기본 글씨 색상 */
  transition: color 0.3s; /* 색상 전환 효과 */
}

.user-type::after {
  content: '';
  display: block;
  height: 2px; /* 아래 선의 두께 */
  background-color: transparent; /* 기본 색상 */
  position: absolute;
  bottom: -5px; /* 아래 선 위치 */
  left: 0;
  right: 0;
  transition: background-color 0.3s; /* 색상 전환 효과 */
}

.user-type.active::after {
  background-color: #024CAA; /* 활성화된 회원 유형의 색상 */
}

.user-type.selected {
  color: #024CAA; /* 선택된 회원 유형의 색상 */
}

.wooribound-logo {
  width: 120px;
  margin: 20px 0;
}

.input-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 300px;
}

.input-field {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  box-sizing: border-box;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #413F42;
}

.delete-button {
  width: 95%;
  padding: 10px;
  margin-top: 20px;
  background-color: #024CAA;
  color: white;
  text-align: center;
  cursor: pointer;
  font-weight: bold;
  border-radius: 8px;
}

.forgot-password {
  margin-top: 10px;
  font-size: 14px;
  color: #024CAA;
  cursor: pointer;
  font-weight: bold;
}

.signup-link {
  margin-top: 40px;
  font-size: 16px;
  cursor: pointer;
  border: 1px solid #413F42; /* 선색 설정 */
  border-radius: 8px; /* 꼭지점 둥글게 설정 */
  padding: 10px; /* 여백 추가 */
  text-align: center; /* 중앙 정렬 */
  width: 100%; /* 너비 100% */
}

.login-guide {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.login-type {
  display: flex;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
  width: 250px; /* 컨테이너 크기 조절 */
  margin: 0 auto; /* 중앙 정렬 */
}

.naver-logo {
  width: 300px; /* 이미지 크기 줄임 */
  height: 45px; /* 높이 명시적 지정으로 두께 조절 */
  object-fit: contain; /* 이미지 비율 유지 */
}

.login-type:hover {
  transform: scale(1.02);  /* 호버시 살짝 커지는 효과 */
}

.login-benefit {
  margin-top: 20px;
  color: #666;
  font-size: 14px;
  text-align: center;
  line-height: 1.5;
}

.error-message {
  color: #dc3545;
  font-size: 14px;
  margin: 8px 0;
  text-align: center;
  width: 100%;
}
</style>
