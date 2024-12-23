<script>
import { ref } from 'vue';
import { useRouter } from "vue-router";
import { ROUTES } from "@/router/routes";
import { adminLogin } from "@/api/services/authenticationService"; // 관리자 로그인 API

export default {
  name: "AdminLoginView",
  setup() {
    const router = useRouter();
    const username = ref('');
    const password = ref('');
    const errorMessage = ref('');

    const onAdminLoginClick = async () => {
      // 입력값 검증
      if (!username.value || !password.value) {
        errorMessage.value = '아이디와 비밀번호를 모두 입력해주세요.';
        return;
      }

      try {
        await adminLogin(username.value, password.value);
        // 로그인 성공 및 사용자 정보 저장이 완료되면 메인 페이지로 이동
        router.push(ROUTES.MAIN.path);
      } catch (error) {
        console.error('로그인 실패:', error);
        errorMessage.value = error.message === 'No access token in response' ||
        error.message === 'Refresh token not found in cookies'
            ? '서버 응답이 올바르지 않습니다.'
            : '아이디 또는 비밀번호가 올바르지 않습니다.';
      }
    }

    return {
      username,
      password,
      errorMessage,
      onAdminLoginClick
    };
  }
}
</script>

<template>
  <main class="body">
    <div class="header">관리자 로그인</div>
    <div class="content">
      <img src="@/assets/images/logo/wooribound_logo.png" class="wooribound-logo">
      <div class="input-section">
        <input
            class="input-field"
            placeholder="아이디"
            v-model="username"
            @keyup.enter="onAdminLoginClick">
        <input
            class="input-field"
            placeholder="비밀번호"
            type="password"
            v-model="password"
            @keyup.enter="onAdminLoginClick">
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <div class="login-button" @click="onAdminLoginClick">로그인</div>
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
  justify-content: center;
  flex: 1;
}

.wooribound-logo {
  width: 120px;
  margin: 20px 0 40px 0;
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
  padding: 12px;
  margin: 10px 0;
  box-sizing: border-box;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #413F42;
  outline: none;
}

.input-field:focus {
  border-color: #024CAA;
}

.login-button {
  width: 100%;
  padding: 12px;
  margin-top: 20px;
  background-color: #024CAA;
  color: white;
  text-align: center;
  cursor: pointer;
  font-weight: bold;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #023d88;
}

.error-message {
  color: #dc3545;
  font-size: 14px;
  margin: 8px 0;
  text-align: center;
  width: 100%;
}
</style>