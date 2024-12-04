<script>

import {ROUTES} from "@/router/routes";
import {useRouter} from "vue-router";
import {computed} from "vue";

export default {
  name: "MenuGuidePopup",
  computed: {
    ROUTES() {
      return ROUTES
    }
  },
  props: {
    menuGuideType: {
      type: String,
      required: true,
    },
  },
  setup(props, {emit}) {
    const router = useRouter();

    const selectedMenuGuideType = computed(() => props.menuGuideType);

    const closeModal = () => {
      emit('close-modal', false);
    }

    let startY = 0;
    let currentY = 0;
    let isDragging = false;

    const handleTouchStart = (event) => {
      startY = event.touches[0].clientY;
      isDragging = true;
    };

    const handleTouchMove = (event) => {
      if (!isDragging) return;
      currentY = event.touches[0].clientY;
      const distance = Math.max(currentY - startY, 0); // 위로 올리는 동작 방지
      const modalContent = document.querySelector(".modal-container");
      modalContent.style.transform = `translateY(${distance}px)`;
    };

    const handleTouchEnd = () => {
      isDragging = false;
      const distance = currentY - startY;
      const modalContent = document.querySelector(".modal-container");

      if (distance > window.innerHeight * 0.3) {
        // 30% 이상 드래그하면 닫기
        closeModal();
      } else {
        // 원래 위치로 복원
        modalContent.style.transform = "translateY(0)";
      }
    };

    const navigateToJobPostings = (viewType) => {
      router.push({
        name: ROUTES.JOB_POSTINGS_PAGE.name,
        params:{
          viewType: viewType
        },
      })
    }

    return {
      selectedMenuGuideType,
      closeModal,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
      navigateToJobPostings,
    };
  }
}
</script>

<template>
  <div
      class="modal-overlay"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
  >
    <div class="modal-container">
      <div class="modal-handle"></div>
      <div class="menu-content" v-if="selectedMenuGuideType === 'user'">
        <div class="menu_title">
          내 정보 보기
          <div class="close-button" @click="closeModal" v-if="false">
            <img src="@/assets/images/icons/close.png" alt="Close" />
          </div>
        </div>
        <div class="menu-items" @click="closeModal">
          <router-link :to="ROUTES.INDIVIDUAL_USER_PROFILE.path">
            <div class="menu-item">개인 정보</div>
          </router-link>
          <router-link :to="ROUTES.RESUME_PAGE.path">
            <div class="menu-item">이력서</div>
          </router-link>
          <router-link :to="ROUTES.JOB_APPLICATION_STATUS.path">
            <div class="menu-item">지원 현황</div>
          </router-link>
          <router-link :to="ROUTES.MY_WORK_EXPERIENCE_PAGE.path">
            <div class="menu-item">내가 쓴 글</div>
          </router-link>
          <router-link :to="ROUTES.WOORIBOUND_ELEVATION_INFO.path">
            <div class="menu-item">우바 고도</div>
          </router-link>
        </div>
      </div>
      <div class="menu-content" v-if="selectedMenuGuideType === 'company'">
        <div class="menu_title">
          일자리 찾기
          <div class="close-button" @click="closeModal" v-if="false">
            <img src="@/assets/images/icons/close.png" alt="Close" />
          </div>
        </div>
        <div class="menu-items" @click="closeModal">
            <div class="menu-item" @click="navigateToJobPostings('career')">경력 살리기</div>
            <div class="menu-item" @click="navigateToJobPostings('new')">새로운 일 찾기</div>
            <div class="menu-item" @click="navigateToJobPostings('all')">전체 조회</div>
        </div>
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
  flex-direction: column; /* 세로 배치 설정 */
  justify-content: flex-end; /* 요소를 아래쪽으로 정렬 */
  align-items: center; /* 수평 중앙 정렬 */
  z-index: 500;
}

.modal-container {
  width: 100%;
  transform: translateY(0); /* 초기 위치 */
  transition: transform 0.3s ease-out; /* 복원 애니메이션 */
  will-change: transform; /* 성능 최적화 */
}

.modal-handle {
  width: 50px; /* 핸들의 너비 */
  height: 5px; /* 핸들의 높이 */
  background-color: #ccc; /* 핸들의 색상 */
  border-radius: 50px; /* 둥근 모서리 */
  margin: 10px auto; /* 상단 여백과 중앙 정렬 */
}

.menu-content {
  background-color: #fff;
  border-radius: 20px 20px 0 0;
  width: 100%;
  height: 100%;
  margin-bottom: 20px;
}

.menu_title {
  display: flex; /* 플렉스 박스 사용 */
  justify-content: space-between; /* 양쪽 끝 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
  font-weight: bold;
  font-size: 24px;
  padding: 20px;
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
  font-size: 19px;
  padding: 0 20px;
}

.menu-item {
  padding: 10px 0; /* 항목의 상하 여백 */
  cursor: pointer; /* 마우스 포인터가 아이템에 올 때 손가락 모양으로 변경 */
}

.menu-item:last-child {
  border-bottom: none; /* 마지막 항목의 구분선 제거 */
}
</style>
