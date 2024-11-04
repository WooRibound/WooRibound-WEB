<script>
import TwoButtonModal from "@/components/TwoButtonModal.vue";
import {ref} from "vue";
import {ROUTES} from "@/router/routes";
export default {
  name: "CorporateUserDelete",
  computed: {
    ROUTES() {
      return ROUTES
    }
  },
  components: { TwoButtonModal },
  setup() {
    const modalPopupStatue = ref(false);

    const onDeleteAccountClick = () => {
      // todo 일반회원 탈퇴하기 API 구현 시 아래에 로직 구현하기
      console.log("탈퇴하기")
      modalPopupStatue.value = true;
    }

    return {
      modalPopupStatue,
      onDeleteAccountClick,
    };
  }
}
</script>

<template>
  <div class="body">
    <div class="header">기업 정보</div>
    <div class="subtitle">회원 탈퇴</div>
    <div class="content">
      <div class="input-section">
        <input class="input-field" placeholder="비밀번호" type="password">
        <div class="delete-button" @click="onDeleteAccountClick">탈퇴하기</div>
      </div>
    </div>
  </div>
  <two-button-modal
      v-if="modalPopupStatue"
      @close-modal="modalPopupStatue = false"
      :router-path="ROUTES.USER_DELETE_SUCCESS.path"
      modal-message="정말로 탈퇴하시겠습니까?"
  />
</template>

<style scoped>
.body {
  flex: 1;                      /* 가변 영역, 헤더와 바텀 내비게이션을 제외한 나머지 공간 차지 */
  padding: 20px;                /* 내부 여백 */
  box-sizing: border-box;       /* 패딩을 포함한 크기 계산 */
  background-color: #f8f9fa;    /* 배경색 */
  overflow-y: auto;             /* 내용이 넘칠 경우 스크롤 가능 */
}

.header {
  font-size: 24px;              /* 헤더 폰트 크기 */
  font-weight: bold;            /* 헤더 두껍게 */
  margin-bottom: 20px;          /* 아래쪽 여백 */
}

.subtitle {                     /* 소제목 스타일 */
  font-size: 18px;              /* 글자 크기 */
  font-weight: bold;            /* 글자 두께 */
  margin-bottom: 10px;          /* 아래쪽 여백 */
  color: #333;                  /* 텍스트 색상 */
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 130px;
  flex: 1;                      /* 가변 영역 */
  height: 100%;                 /* 전체 높이를 사용하도록 설정 */
}

.input-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 300px;
}

.input-field {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  box-sizing: border-box;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #413F42;
}

.delete-button {
  width: 95%;
  padding: 10px;
  margin-top: 20px;
  background-color: #024CAA;
  color: white;
  text-align: center;
  cursor: pointer;
  font-weight: bold;
  border-radius: 8px;
}
</style>