<template>
  <div class="app-container" v-if="!fullScreenMenuState">
    <header-component @fullMenu-state-changed="fullScreenMenuStateChanged"/>
    <router-view />
    <bottom-navigation
        v-if="!isAdmin"
        @icon-state-changed="handleIconStateChanged"
    />
  </div>

  <div class="app-container" v-if="fullScreenMenuState">
    <full-screen-menu
        :full-screen-menu-state="fullScreenMenuState"
        @close-menu="fullScreenMenuState = false"
    />
  </div>
</template>

<script>
import {ref, computed, onMounted} from 'vue';
import BottomNavigation from "@/components/BottomNavigation.vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import FullScreenMenu from "@/views/Common/FullScreenMenu.vue";
import { useUserStore } from "@/stores/userStore";
import { USER_TYPES } from "@/constants/userTypes";
import {useJobStore} from "@/stores/useJobStore";

export default {
  name: 'App',
  components: {
    FullScreenMenu,
    HeaderComponent,
    BottomNavigation
  },
  setup() {
    const jobStore = useJobStore();

    const iconState = ref({});
    const fullScreenMenuState = ref(false);

    const handleIconStateChanged = (newState) => {
      iconState.value = newState;
    };

    const fullScreenMenuStateChanged = (newState) => {
      fullScreenMenuState.value = newState;
    };

    // todo 로그인 기능 구현 시 삭제 해야될 코드
    const userStore = useUserStore();
    // userStore.isLoggedIn = false;
    // userStore.userType = USER_TYPES.INDIVIDUAL_USER;
    // userStore.userType = USER_TYPES.CORPORATE_MEMBER;
    // userStore.userType = USER_TYPES.SERVICE_ADMIN;
    // userStore.userType = USER_TYPES.INFRA_ADMIN;
    //
    const isAdmin = computed(() => {
      return userStore.userType === USER_TYPES.INFRA_ADMIN || userStore.userType === USER_TYPES.SERVICE_ADMIN;
    });

    onMounted(() => {
      jobStore.fetchJobs();
    });

    return {
      isAdmin,
      iconState,
      fullScreenMenuState,
      handleIconStateChanged,
      fullScreenMenuStateChanged,
    };
  }
}
</script>

<style scoped>
.app-container {
  display: flex;                /* Flexbox 사용 */
  flex-direction: column;       /* 세로 방향 정렬 */
  min-height: 100vh;           /* 최소 높이 전체 화면 */
}
</style>
