<script>
import { useLoadingStore } from '@/stores/useLodingStore'
import {computed} from "vue";
export default {
  name: "LoadingOverlay",
  setup(){
    const loadingStore = useLoadingStore();
    const isLoading = computed(() => loadingStore.isLoading);

    return {
      isLoading,
    };
  }
}
</script>

<template>
  <div v-if="isLoading" class="loading-overlay">
    <div class="loader"></div>
  </div>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loader {
  margin: 5% auto;
  height: 100px; /* 원의 크기 */
  width: 100px; /* 원의 크기 */
  border: 6px solid #fff; /* 테두리 두께와 색상 */
  border-right-color: #024CAA; /* 애니메이션되는 색상 */
  border-top-color: #024CAA; /* 애니메이션되는 색상 */
  border-radius: 50%; /* 원형으로 만들기 */
  animation: spin 800ms infinite linear; /* 회전 애니메이션 */
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>