<script>
import { decodeToken } from "@/utils/tokenDecoder";
import { useUserStore } from '@/stores/userStore';

export default {
  name: "MainView",
  mounted() {
    console.log('MainView mounted');
    this.storeAccessToken();
  },
  methods: {
    async storeAccessToken() {
      const accessToken = this.getAccessTokenFromHash();
      console.log('Got access token from query:', accessToken);

      if (accessToken) {
        // accessToken을 localStorage에 'Bearer ' 접두사와 함께 저장
        const tokenWithBearer = `Bearer ${accessToken}`;
        localStorage.setItem("accessToken", tokenWithBearer);
        console.log('Stored token in localStorage:', tokenWithBearer);

        // store 직접 접근하여 상태 확인
        const store = useUserStore();
        console.log('Initial store state:', store.$state);

        // decodeToken 함수가 토큰 디코딩과 store 저장을 모두 처리
        const success = decodeToken();
        console.log('Decode token result:', success);

        if (success) {
          // 저장 후 store 상태 확인
          console.log('Updated store state:', store.$state);
          console.log('Successfully decoded token and set user info');
          // URL에서 쿼리 파라미터 제거
          window.history.replaceState({}, document.title, window.location.pathname);
        } else {
          console.error('Failed to decode token and set user info');
        }
      }
    },
    getAccessTokenFromHash() {
      // URL 해시에서 토큰 추출
      const hash = window.location.hash;
      if (hash.includes('accessToken=')) {
        return hash.split('accessToken=')[1];
      }
      return null;
    }
  }
}
</script>

<template>
  <main class="body">
    <div>
      메인페이지
    </div>
  </main>
</template>

<style scoped>
.body {
  flex: 1;                      /* 가변 영역, 헤더와 바텀 내비게이션을 제외한 나머지 공간 차지 */
  padding: 20px;                /* 내부 여백 */
  box-sizing: border-box;       /* 패딩을 포함한 크기 계산 */
  background-color: #f8f9fa;    /* 배경색 */
  overflow-y: auto;             /* 내용이 넘칠 경우 스크롤 가능 */
}
</style>
