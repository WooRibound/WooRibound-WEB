<script>
import { onMounted, ref } from "vue";
import { ROUTES } from "@/router/routes";
import { fetchLogDashboard } from "@/api/services/adminServiece";
import { useRouter } from "vue-router"; 
import SingleButtonModal from "@/components/SingleButtonModal.vue"; 

export default {
  name: "LogDashboardManagement",
  components: {
    SingleButtonModal,
  },
  computed: {
    ROUTES() {
      return ROUTES
    }
  },
  setup() {
    const isDashboardVisible = ref(false);
    const isError = ref(false);
    const modalMessage = "접근 권한이 없습니다.";

    const monitoringURL = process.env.VUE_APP_MONITORING_URL;

    const router = useRouter();

    const loadDashboard = async () => {
      try {
        const response = await fetchLogDashboard();
        if (response === "Y") {
          isDashboardVisible.value = true;
        } else {
          isError.value = true;
        }
      } catch (error) {
        console.error("fetchLogDashboard API 호출 오류:", error);
      }
    };

    onMounted(() => {
      loadDashboard();
    });

    const handleCloseModal = () => {
      isError.value = false;
      router.push(ROUTES.ADMIN_MAIN.path);
    };

    return {
      isDashboardVisible,
      isError,
      modalMessage,
      handleCloseModal,
      monitoringURL
    };
  },
};
</script>

<template>
  <main class="body">
    <div class="header">
      <div class="header-title">인프라 대시보드</div>
    </div>

    <div v-if="isDashboardVisible" class="content">
      <iframe :src="`${monitoringURL}/d-solo/fe52n5f3ny4u8b/wb-infra?orgId=1&theme=light&panelId=5`"
              class="full-width-iframe" frameborder="0">
      </iframe>

      <div class="iframe-row">
        <iframe :src="`${monitoringURL}/d-solo/fe52n5f3ny4u8b/wb-infra?orgId=1&theme=light&panelId=1`"
                class="half-width-iframe" frameborder="0">
        </iframe>
        <iframe :src="`${monitoringURL}/d-solo/fe52n5f3ny4u8b/wb-infra?orgId=1&theme=light&panelId=3`"
                class="half-width-iframe" frameborder="0">
        </iframe>
      </div>

      <div class="iframe-row">
        <iframe :src="`${monitoringURL}/d-solo/fe52n5f3ny4u8b/wb-infra?orgId=1&theme=light&panelId=2`"
                class="half-width-iframe" frameborder="0">
        </iframe>
        <iframe :src="`${monitoringURL}/d-solo/fe52n5f3ny4u8b/wb-infra?orgId=1&theme=light&panelId=4`"
                class="half-width-iframe" frameborder="0">
        </iframe>
      </div>
    </div>

    <single-button-modal v-if="isError" :modal-message="modalMessage" @close-modal="handleCloseModal" />
  </main>
</template>

<style scoped>
.body {
  padding: 20px;
  background-color: #f8f9fa;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.full-width-iframe {
  width: 100%;
  height: 300px;
  margin-bottom: 20px;
}

.iframe-row {
  display: flex;
  width: 100%;
  gap: 10px;
}

.half-width-iframe {
  width: 50%;
  height: 200px;
}
</style>
