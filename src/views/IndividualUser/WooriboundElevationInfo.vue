<script>

import { ref, onMounted } from "vue";
import { fetchJobPoint } from "@/api/services/individualUserService"; // API 호출 함수

export default {
  name: "WooriboundElevationInfo",
  setup() {
    const currentElevation = ref(0); // 신뢰도 점수
    const isLoading = ref(false); // 로딩 상태

    // 신뢰도 점수 가져오기
    const loadJobPoint = async () => {
      isLoading.value = true; // 로딩 시작
      try {
        currentElevation.value = await fetchJobPoint(); // API 호출 및 점수 설정
      } catch (error) {
        console.error("Failed to fetch job point:", error);
        alert("신뢰도 점수 조회에 실패했습니다.");
      } finally {
        isLoading.value = false; // 로딩 종료
      }
    };

    // 컴포넌트 로드 시 데이터 호출
    onMounted(() => {
      loadJobPoint();
    });

    return {
      currentElevation
    };
  }
}
</script>

<template>
  <main class="body">
    <div class="header">우바 고도</div>
    <div class="job-posting-wrap">
      <div class="mountains-container">
        <img src="@/assets/images/icons/mountains.png" class="mountains-icon">
      </div>
      <div class="job-posting-info-container">
        <div class="job-posting-info">설악산 총 고도 <br> 1,708m</div>
        <div class="job-posting-info">현재고도 <br>{{ currentElevation }}m</div>
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
  margin-bottom: 20px;
}

.job-posting-wrap {
  margin-top: 10px;
}

.mountains-container {
  position: relative;
}

.mountains-icon {
  max-width: 100%;
  height: auto;
  display: block;
}

.mountains-container::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  //background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%);
  pointer-events: none;
}

.job-posting-info-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
  gap: 10px; /* 각 아이템 사이 간격 */
}

.job-posting-info {
  font-size: 16px;
  font-weight: bold;
  padding: 10px 15px; /* 내부 여백 */
  background-color: #ffffff; /* 흰색 배경 */
  border-radius: 8px; /* 둥근 모서리 */
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); /* 약간의 그림자 */
  margin: 0; /* 불필요한 여백 제거 */
  width: 300px;
  line-height: 1.6; /* 텍스트 줄 간격 */
}
</style>