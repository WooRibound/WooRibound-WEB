<script>
import {ROUTES} from "@/router/routes";

export default {
  name: "NotFoundPageView",
  computed: {
    ROUTES() {
      return ROUTES
    }
  },
  setup() {
    return {};
  }
}
</script>

<template>
  <div class="not-found-container">
    <img src="@/assets/images/icons/prohibit.png">
    <p class="error-message">페이지를 찾을 수 없습니다.</p>
    <p class="suggestion">홈페이지로 돌아가려면 아래 버튼을 클릭하세요.</p>
    <router-link :to="ROUTES.MAIN.path" class="home-button">홈으로 가기</router-link>
  </div>
</template>

<style scoped>
.not-found-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100vh;
  color: #333;
  background-color: #f5f5f5;
}

.error-message {
  font-size: 24px;
  margin-top: 10px;
  color: #333;
}

.suggestion {
  font-size: 16px;
  color: #666;
  margin-top: 5px;
}

.home-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #024CAA;
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.home-button:hover {
  background-color: #0056b3;
}
</style>
