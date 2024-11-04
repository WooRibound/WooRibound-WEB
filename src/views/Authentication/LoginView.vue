<script>
import { ref } from 'vue';
import { USER_TYPES } from "@/constants/userTypes";
import { useRouter } from "vue-router";
import { ROUTES } from "@/router/routes";

export default {
  name: "LoginView",
  setup() {
    const router = useRouter();

    const activeUserType = ref(USER_TYPES.INDIVIDUAL_USER); // 기본값: 개인 회원

    const onSetActiveUserTypeClick = (type) => {
      activeUserType.value = type;
    };

    const onIndividualUserLoginClick = () => {
      console.log("개인회원 로그인 하기");
      // todo 개인 회원 Oauth 구현 시 로그인 로직 넣기
      router.push(ROUTES.INDIVIDUAL_USER_REGISTER.path);
    }

    const onCorporateUserLoginClick = () => {
      console.log("기업회원 로그인 하기");
      // todo 기업 회원 로그인 API 구현 시 로직 넣기
      router.push(ROUTES.MAIN.path);
    }

    return {
      activeUserType,
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
      <img src="@/assets/images/logo/wooribound_logo.png" class="wooribound-logo">
      <div class="input-section" v-if="activeUserType === USER_TYPES.INDIVIDUAL_USER">
        <div class="login-type" @click="onIndividualUserLoginClick">
          <img src="@/assets/images/icons/naver.png" class="naver-logo">
          네이버 계정으로 로그인하기
        </div>
      </div>
      <div class="input-section" v-if="activeUserType === USER_TYPES.CORPORATE_MEMBER">
        <input class="input-field" placeholder="아이디">
        <input class="input-field" placeholder="비밀번호" type="password">
        <div class="delete-button" @click="onCorporateUserLoginClick">로그인</div>
        <router-link :to="ROUTES.CORPORATE_USER_FIND_PASSWORD.path" class="forgot-password">비밀번호 찾기</router-link>
        <router-link :to="ROUTES.CORPORATE_USER_REGISTER.path" class="signup-link">회원가입 하기</router-link>
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
  height: 100%; /* 전체 높이를 사용하도록 설정 */
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

.login-type {
  display: flex;
  align-items: center; /* 이미지와 텍스트를 수직으로 정렬 */
  margin-top: 10px; /* 상단 여백 추가 */
  border: 1px solid #413F42; /* 선색 설정 */
  border-radius: 30px; /* 꼭지점 둥글게 설정 */
  padding: 10px; /* 여백 추가 */
  width: 100%; /* 너비 100% */
  justify-content: center; /* 중앙 정렬 */
  font-weight: bold;
  height: 30px;
}

.naver-logo {
  width: 35px; /* 이미지 너비 조정 */
  height: auto; /* 비율 유지 */
  margin-right: 10px; /* 텍스트와의 간격 설정 */
}
</style>
