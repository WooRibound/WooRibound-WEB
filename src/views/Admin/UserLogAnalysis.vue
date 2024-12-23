<script>

export default {
  name: "UserLogAnalysis",
  setup() {
    const openKibanaDashboard = () => {
      window.open('/kibana/app/r/s/lvkeu', '_blank', 'noopener,noreferrer');
    };

    return {
      openKibanaDashboard
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
      <div class="kibana-button-container">
        <button
            @click="openKibanaDashboard"
            class="open-kibana-button"
        >
          Kibana 대시보드 열기
        </button>
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
  display: flex;
  justify-content: center;
  align-items: center;
}

.kibana-button-container {
  text-align: center;
}

.open-kibana-button {
  padding: 12px 24px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.open-kibana-button:hover {
  background-color: #0056b3;
}
</style>