<script>
import {computed, onMounted, ref} from "vue";
import {useUserStore} from "@/stores/userStore";
import {USER_TYPES} from "@/constants/userTypes";
import {useRouter} from "vue-router";
import {ROUTES} from "@/router/routes";
import {useNotificationStore} from "@/stores/useNotificationStore";

export default {
  name: "HeaderComponent",
  computed: {
    USER_TYPES() {
      return USER_TYPES
    }
  },
  setup(props, { emit }) {
    const userStore = useUserStore();
    const notificationStore = useNotificationStore();
    const router = useRouter();

    const showFullMenuState = ref(false);
    const notificationCount = computed(() => notificationStore.getCount);
    const isLoggedIn = computed(() => userStore.isLoggedIn);
    const userType = computed(() => userStore.getCurrentUserType);

    const onShowNotificationClick = () => {
      router.push(ROUTES.NOTIFICATION_PAGE);
    }

    const onShowFullMenuClick = () => {
      showFullMenuState.value = !showFullMenuState.value;
      emit('fullMenu-state-changed', showFullMenuState.value);
    }

    onMounted(() => {
      notificationStore.fetchAllNotification();
    })

    return {
      isLoggedIn,
      userType,
      showFullMenuState,
      notificationCount,
      onShowNotificationClick,
      onShowFullMenuClick,
    };
  }
}
</script>

<template>
  <header class="header">
    <div class="header-left">
      <router-link to="/">
        <img src="@/assets/images/logo/wooribound_logo.png" class="logo-image">
      </router-link>
    </div>
    <div class="header-right">
      <div class="notification-wrapper" @click="onShowNotificationClick" v-if="isLoggedIn & userType === USER_TYPES.INDIVIDUAL_USER">
        <img src="@/assets/images/icons/notification.png" class="notification-icon">
        <div class="message-count" v-if="notificationCount > 0">{{ notificationCount }}</div>
      </div>
      <img src="@/assets/images/icons/hamburger_button_menu.png" class="menu-icon" @click="onShowFullMenuClick">
    </div>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  padding: 0 10px;
  height: 60px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.logo-image {
  width: 70%;
  max-width: 150px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.menu-icon {
  width: 30px;
  height: 30px;
}

.notification-wrapper {
  position: relative;
  width: 35px;
  height: 35px;
  margin-right: 10px;
  cursor: pointer;
}

.notification-icon {
  width: 35px;
  height: 35px;
}

.message-count {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #024CAA;
  color: white;
  border-radius: 50%;
  padding: 5px;
  font-size: 15px;
  width: 24px;
  height: 24px;
  display: flex; /* Flexbox를 사용하여 중앙 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
  justify-content: center; /* 가로 중앙 정렬 */
  font-weight: bold;
}

</style>