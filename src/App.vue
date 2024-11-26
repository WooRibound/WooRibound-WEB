<template>
  <div class="app-container" v-if="!fullScreenMenuState">
    <header-component @fullMenu-state-changed="fullScreenMenuStateChanged"/>
    <router-view />
    <bottom-navigation
        v-if="!isAdmin"
        @icon-state-changed="handleIconStateChanged"
    />
    <loading-overlay />
    <login-modal />
  </div>

  <div class="app-container" v-if="fullScreenMenuState">
    <full-screen-menu
        :full-screen-menu-state="fullScreenMenuState"
        @close-menu="fullScreenMenuState = false"
    />
  </div>
</template>

<script>
import {computed, onMounted, ref} from 'vue';
import BottomNavigation from "@/components/BottomNavigation.vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import FullScreenMenu from "@/views/Common/FullScreenMenu.vue";
import {useUserStore} from "@/stores/userStore";
import {USER_TYPES} from "@/constants/userTypes";
import {useJobStore} from "@/stores/useJobStore";
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import LoginModal from "@/components/LoginModal.vue";

export default {
  name: 'App',
  components: {
    LoginModal,
    LoadingOverlay,
    FullScreenMenu,
    HeaderComponent,
    BottomNavigation
  },
  setup() {
    const jobStore = useJobStore();
    const userStore = useUserStore();

    const iconState = ref({});
    const fullScreenMenuState = ref(false);

    const handleIconStateChanged = (newState) => {
      iconState.value = newState;
    };

    const fullScreenMenuStateChanged = (newState) => {
      fullScreenMenuState.value = newState;
    };

    const isAdmin = computed(() => {
      return userStore.getCurrentUserType === USER_TYPES.INFRA_ADMIN || userStore.getCurrentUserType === USER_TYPES.SERVICE_ADMIN;
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

</style>
