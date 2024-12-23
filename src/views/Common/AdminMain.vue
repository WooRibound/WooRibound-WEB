<script>
import { computed } from 'vue';
import { useUserStore } from "@/stores/userStore";
import { USER_TYPES } from "@/constants/userTypes";

export default {
  name: "AdminMain",
  setup() {
    const userStore = useUserStore();

    const titleText = computed(() => {
      switch (userStore.userType) {
        case USER_TYPES.SERVICE_ADMIN:
          return "서비스 관리자 입니다.";
        case USER_TYPES.INFRA_ADMIN:
          return "인프라 관리자 입니다.";
        default:
          return "알 수 없는 사용자입니다.";
      }
    });

    const imageSource = computed(() => {
      switch (userStore.userType) {
        case USER_TYPES.SERVICE_ADMIN:
          return require("@/assets/images/icons/service_admin.png");
        case USER_TYPES.INFRA_ADMIN:
          return require("@/assets/images/icons/infra_admin.png");
        default:
          return require("@/assets/images/icons/unknown_admin.png");
      }
    });

    return {
      titleText,
      imageSource,
    };
  },
};
</script>

<template>
  <main class="body">
    <div>
      <div class="admin_title">{{ titleText }}</div>
      <div class="admin_image_wrap">
        <img class="admin_image" :src="imageSource" v-if="imageSource" />
      </div>
    </div>
  </main>
</template>

<style scoped>
.body {
  flex: 1;                      /* 가변 영역, 헤더와 바텀 내비게이션을 제외한 나머지 공간 차지 */
  padding: 20px;                /* 내부 여백 */
  box-sizing: border-box;       /* 패딩을 포함한 크기 계산 */
  overflow-y: auto;             /* 내용이 넘칠 경우 스크롤 가능 */
  display: flex;                /* Flexbox 사용 */
  flex-direction: column;       /* 세로 방향으로 정렬 */
  align-items: center;          /* 수평 중앙 정렬 */
  justify-content: center;      /* 수직 중앙 정렬 */
  height: 100vh;                /* 전체 화면 높이 사용 */
}

.admin_title {
  font-weight: bold;            /* 굵은 글씨체 */
  font-size: 24px;              /* 폰트 크기 설정 (조정 가능) */
  margin-bottom: 20px;          /* 텍스트와 이미지 사이 여백 */
}

.admin_image_wrap {
  display: flex;                /* Flexbox 사용 */
  justify-content: center;      /* 수평 중앙 정렬 */
  align-items: center;          /* 수직 중앙 정렬 */
}

.admin_image {
  width: 200px;                 /* 이미지 너비 설정 */
}

</style>