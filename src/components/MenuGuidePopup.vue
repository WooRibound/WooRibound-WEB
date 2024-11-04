<script>

import {ROUTES} from "@/router/routes";

export default {
  name: "MenuGuidePopup",
  computed: {
    ROUTES() {
      return ROUTES
    }
  },
  setup(props, {emit}) {

    const closeModal = () => {
      emit('close-modal', false);
    }

    return {
      closeModal
    };
  }
}
</script>

<template>
  <div class="modal-overlay">
    <div class="menu-content">
      <div class="menu_title">
        내 정보 보기
        <div class="close-button" @click="closeModal">
          <img src="@/assets/images/icons/close.png" alt="Close" />
        </div>
      </div>
      <div class="menu-items" @click="closeModal">
        <router-link :to="ROUTES.JOB_APPLICATION_STATUS.path">
          <div class="menu-item">지원 현황</div>
        </router-link>
        <router-link :to="ROUTES.RESUME_PAGE.path">
          <div class="menu-item">이력서</div>
        </router-link>
        <router-link :to="ROUTES.INDIVIDUAL_USER_PROFILE.path">
          <div class="menu-item">개인 정보</div>
        </router-link>
        <router-link :to="ROUTES.WOORIBOUND_ELEVATION_INFO.path">
          <div class="menu-item">우바 고도</div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100% - 72px);
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 999;
}

.menu-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 100%;
  height: 50%;
  margin-bottom: 0;
}

.menu_title {
  display: flex; /* 플렉스 박스 사용 */
  justify-content: space-between; /* 양쪽 끝 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 15px;
}

.close-button {
  cursor: pointer; /* 마우스 포인터가 아이템에 올 때 손가락 모양으로 변경 */
  margin-left: auto; /* 제목과의 간격을 자동으로 설정하여 오른쪽 끝으로 이동 */
}

.close-button img {
  width: 24px; /* 이미지 크기 조정 (조정 가능) */
  height: 24px; /* 이미지 크기 조정 (조정 가능) */
}

.menu-items {
  margin-top: 15px; /* 메뉴 제목과 메뉴 항목 사이의 여백 */
  font-size: 19px;
}

.menu-item {
  padding: 10px 0; /* 항목의 상하 여백 */
  cursor: pointer; /* 마우스 포인터가 아이템에 올 때 손가락 모양으로 변경 */
}

.menu-item:last-child {
  border-bottom: none; /* 마지막 항목의 구분선 제거 */
}
</style>
