<script>
import {onMounted, ref} from "vue";
import {updateNotification} from "@/api/services/individualUserService";
import {useUserStore} from "@/stores/userStore";
import {useNotificationStore} from "@/stores/useNotificationStore";

export default {
  name: "NotificationPage",
  setup() {
    const userStore = useUserStore();
    const notificationStore = useNotificationStore();

    const isVisible = ref(false);
    const notificationList = ref([]);
    const notificationMessage = ref("");

    const fetchNotification = () => {
      if (!userStore.isLoggedIn) {
        return;
      }
      const response =  notificationStore.getNotifications;

      notificationList.value = response.map(item => ({
        notiId: item.notiId,
        notice: item.notice,
        isConfirmed: item.isConfirmed,
        createAt: item.createAt,
      }));

    }

    onMounted(async () => {
      await notificationStore.fetchAllNotification();
      fetchNotification();
    })

    const onViewMassageClick = async (notiId, isConfirmed) => {
      const notification = notificationList.value.find(item => item.notiId === notiId);

      if (notification) {
        notificationMessage.value = notification.notice;
      }

      if (isConfirmed === "N") {
        try {
          await updateNotification(notiId);
          await notificationStore.fetchAllNotification();
          await fetchNotification();
        } catch (e) {
          console.error(e);
        }
      }

      isVisible.value = true;
    }

    const onModalButtonClick = () => {
      isVisible.value = false;
    }

    return {
      isVisible,
      notificationList,
      notificationMessage,
      onViewMassageClick,
      onModalButtonClick,
    };
  }
}
</script>

<template>
  <main class="body">
    <div class="header">알림 메시지</div>
    <div class="notification-wrap" v-if="notificationList">
      <div v-for="notification in notificationList"
           :key="notification.notiId"
           class="notification-item"
           @click="onViewMassageClick(notification.notiId, notification.isConfirmed)"
      >
        <div v-if="notification.isConfirmed === 'N'" class="unread-dot"></div>
        <p class="notice-text">
          {{ notification.notice.length > 100 ? notification.notice.slice(0, 100) + '...' : notification.notice }}
        </p>
        <p class="date">{{ notification.createAt }}</p>
      </div>
    </div>
    <div class="notification-wrap" v-else>
      알림 메세지가 없습니다.
    </div>
  </main>
  <div class="overlay" v-if="isVisible">
    <div class="modal">
      <div class="modal-content">
        <p class="modal-message">{{ notificationMessage }}</p>
        <button class="modal-button" @click="onModalButtonClick">닫기</button>
      </div>
    </div>
  </div>
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

.notification-wrap {
  margin-top: 10px;
}

.notification-item {
  background-color: #ffffff;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

.notice-text {
  font-size: 16px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.date {
  font-size: 14px;
  color: #888;
  margin-top: 5px;
}

.unread-dot {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 8px;
  height: 8px;
  background-color: #024CAA;
  border-radius: 50%;
}

.overlay {
  position: fixed; /* 고정 위치 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 반투명 배경 */
  display: flex;
  align-items: center; /* 세로 중앙 정렬 */
  justify-content: center; /* 가로 중앙 정렬 */
  z-index: 1000; /* 다른 요소들 위에 표시 */
}

.modal {
  background-color: white; /* 모달 배경색 */
  border-radius: 8px; /* 모서리 둥글게 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 그림자 효과 */
  padding: 20px; /* 내부 여백 */
  width: 300px; /* 모달 너비 */
  display: flex; /* 플렉스 박스 사용 */
  flex-direction: column; /* 세로 방향 정렬 */
  justify-content: center; /* 세로 중앙 정렬 */
}

.modal-content {
  display: flex;
  flex-direction: column; /* 세로 방향 정렬 */
  align-items: center; /* 가로 중앙 정렬 */
}

.modal-message {
  margin-bottom: 45px; /* 메시지와 버튼 사이 여백 */
  text-align: center; /* 텍스트 중앙 정렬 */
}

.modal-button {
  padding: 10px 20px; /* 버튼 내부 여백 */
  border: none; /* 기본 테두리 제거 */
  border-radius: 5px; /* 모서리 둥글게 */
  background-color: #024CAA; /* 버튼 배경색 */
  color: white; /* 버튼 텍스트 색상 */
  cursor: pointer; /* 포인터 커서로 변경 */
  transition: background-color 0.3s; /* 배경색 변화 애니메이션 */
  width: 140px;
}

.modal-button:hover {
  background-color: #003a7a; /* 호버 시 배경색 변화 */
}
</style>