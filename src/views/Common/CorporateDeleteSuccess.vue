<script>
import {useRouter} from 'vue-router';
import { ROUTES } from '@/router/routes'

export default {
  name: "CorporateDeleteSuccess",
  setup() {
    const router = useRouter();

    const onGoToHomeClick = () => {
      router.push(ROUTES.MAIN.path);
    };

    return {
      onGoToHomeClick,
    };
  },
};
</script>

<template>
  <main class="body">
    <div class="content">
      <h1>탈퇴 신청이 완료되었습니다.</h1>
      <p>이용해 주셔서 감사합니다.<br />앞으로 더 나은 서비스를 위해 노력하겠습니다.</p>
      <button @click="onGoToHomeClick" class="home-button">홈으로 돌아가기</button>
    </div>
  </main>
</template>

<style scoped>
.body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f8f9fa;
  overflow-y: auto;
}

.content {
  text-align: center;
  max-width: 500px;
  padding: 40px;
  border-radius: 8px;
}

h1 {
  font-size: 22px;
  margin-bottom: 16px;
  color: #333;
}

p {
  font-size: 16px;
  margin-bottom: 32px;
  color: #666;
}

.home-button {
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: #024CAA;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.home-button:hover {
  background-color: #003a7a;
}
</style>
