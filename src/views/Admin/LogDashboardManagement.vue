<script>
export default {
  name: "LogDashboardManagement"
}
</script>

<template>
  <main class="body">
    <div class="header">
      <div class="header-title">로그 대시보드 관리</div>
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
  display: flex;
  justify-content: space-between; /* 두 요소를 양 끝에 배치 */
  align-items: center; /* 세로 정렬을 가운데로 */
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}
</style>