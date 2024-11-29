<script>
import { ref } from "vue";

export default {
  name: "UserLogAnalysis",
  setup() {
    const searchInput = ref("");
    const iframeUrl = ref("https://kibana.wooribound.site/app/r/s/cWdia");

    return {
      searchInput,
      iframeUrl
    };
  }
}
</script>

<template>
  <main class="body">
    <div class="header">
      <div class="header-title">사용자 로그 분석</div>
    </div>
    <div class="dashboard-container">
      <iframe
          :src="iframeUrl"
          class="kibana-frame"
          frameborder="0"
          allowfullscreen
      ></iframe>
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
  justify-content: space-between;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.dashboard-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: calc(100vh - 120px);
}

.kibana-frame {
  width: 100%;
  height: 100%;
  border-radius: 4px;
}
</style>