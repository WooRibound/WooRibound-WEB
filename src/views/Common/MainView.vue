<script>
import { decodeToken } from "@/utils/tokenDecoder";
import { useUserStore } from '@/stores/userStore';
import { loginCheck } from '@/api/services/authenticationService';

export default {
  name: "MainView",
  data() {
    return {
      loading: false,
      error: null,
      loginStatus: null
    }
  },
  mounted() {
    console.log('MainView mounted');
    this.storeAccessToken();
  },
  methods: {
    async storeAccessToken() {
      const accessToken = this.getAccessTokenFromHash();
      console.log('Got access token from query:', accessToken);

      if (accessToken) {
        const tokenWithBearer = `Bearer ${accessToken}`;
        localStorage.setItem("accessToken", tokenWithBearer);
        console.log('Stored token in localStorage:', tokenWithBearer);

        const store = useUserStore();
        console.log('Initial store state:', store.$state);

        const success = decodeToken();
        console.log('Decode token result:', success);

        if (success) {
          console.log('Updated store state:', store.$state);
          console.log('Successfully decoded token and set user info');
          window.history.replaceState({}, document.title, window.location.pathname);
        } else {
          console.error('Failed to decode token and set user info');
        }
      }
    },
    getAccessTokenFromHash() {
      const hash = window.location.hash;
      if (hash.includes('accessToken=')) {
        return hash.split('accessToken=')[1];
      }
      return null;
    },
    async checkLogin() {
      try {
        this.loading = true;
        this.error = null;

        await loginCheck();
        this.loginStatus = '로그인 상태가 유효합니다.';

      } catch (err) {
        this.error = err.message;
        this.loginStatus = '로그인이 필요합니다.';
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<template>
  <main class="body">
    <div class="content">
      <h1 class="title">메인페이지</h1>

      <div class="api-section">
        <button
            @click="checkLogin"
            :disabled="loading"
            class="api-button"
        >
          {{ loading ? '확인 중...' : '로그인 상태 확인' }}
        </button>

        <!-- 로그인 상태 표시 -->
        <div v-if="loginStatus" class="status-box">
          {{ loginStatus }}
        </div>

        <!-- 에러 메시지 표시 -->
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
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

.content {
  max-width: 800px;
  margin: 0 auto;
}

.title {
  font-size: 24px;
  margin-bottom: 20px;
}

.api-section {
  margin-top: 20px;
}

.api-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.api-button:hover {
  background-color: #0056b3;
}

.api-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.status-box {
  margin-top: 20px;
  padding: 15px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.error-message {
  margin-top: 20px;
  padding: 10px;
  background-color: #fff3f3;
  border: 1px solid #dc3545;
  color: #dc3545;
  border-radius: 5px;
}
</style>