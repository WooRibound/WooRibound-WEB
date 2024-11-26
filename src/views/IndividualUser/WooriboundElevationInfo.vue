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
      <div class="job-posting-info">설안산 총 고도 : 1,708m</div>
      <div class="job-posting-info">현재고도 : {{ currentElevation }}m</div>
      <img src="@/assets/images/icons/mountains.png" class="mountains-icon">
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

.header {
  font-size: 24px;              /* 헤더 폰트 크기 */
  font-weight: bold;            /* 헤더 두껍게 */
  margin-bottom: 20px;          /* 아래쪽 여백 */
}

.job-posting-wrap {
  margin-top: 10px;             /* 상단 여백 */
}

.job-posting-info {
  font-size: 20px;              /* 신청 건수 폰트 크기 */
  font-weight: bold;            /* 굵게 설정 */
  margin-left: 10px;
  margin-bottom: 10px;
}

.mountains-icon {
  max-width: 100%;              /* 부모 요소의 너비를 초과하지 않도록 설정 */
  height: auto;                 /* 비율을 유지하여 높이 자동 조정 */
}
</style>