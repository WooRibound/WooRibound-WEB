<script>
import ModalPopup from "@/components/SingleButtonModal.vue";
import {ROUTES} from "@/router/routes";
import {ref} from "vue";

export default {
  name: "JobPostingRegister",
  computed: {
    ROUTES() {
      return ROUTES
    }
  },
  components: {ModalPopup},
  setup() {
    const modalPopupStatue = ref(false);

    const onRegisterClick = () => {
      modalPopupStatue.value = true;
    }

    const onImageRegisterClick = () => {

    }

    return {
      modalPopupStatue,
      onRegisterClick,
      onImageRegisterClick,
    };
  }
}
</script>

<template>
  <main class="body">
    <div class="header">공고 관리</div>
    <div class="subtitle">공고 등록</div>
    <div class="content">
      <div class="input-section">
        <!-- 공고 이미지 등록 -->
        <div class="input-label">
          <span class="required">*</span>
          <input class="input-field" placeholder="공고사진" />
          <button class="image-register-button" @click="onImageRegisterClick">사진등록</button>
        </div>
        <!-- 공고제목 입력  -->
        <div class="input-label">
          <span class="required">*</span>
          <input class="input-field" placeholder="공고 제목">
        </div>
        <!-- 공고 시작 일자 입력 -->
        <div class="input-label">
          <span class="required">*</span>
          <input class="input-field" type="date" data-placeholder="공고 시작 일자" required/>
        </div>
        <!-- 공고 시작 마감 입력 -->
        <div class="input-label">
          <span class="required">*</span>
          <input class="input-field" type="date" data-placeholder="공고 마감 일자" required/>
        </div>
        <div class="delete-button" @click="onRegisterClick">공고 등록</div>
      </div>
    </div>
  </main>
  <modal-popup
      v-if="modalPopupStatue"
      @close-modal="modalPopupStatue = false"
      :modal-message="'공고 등록이 완료 되었습니다.'"
      :router-path="ROUTES.JOB_POSTING_MANAGEMENT.path"
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
  justify-content: space-between; /* 콘텐츠와 요소를 공간을 균등하게 분배 */
  height: 100%; /* 전체 높이를 사용하도록 설정 */
}

.input-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  flex: 1; /* 가변적으로 공간을 차지하도록 설정 */
}

.input-label {
  display: flex; /* 수평 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
  width: 100%;
}

.input-field {
  width: 100%; /* 너비를 100%로 설정하여 부모 요소의 전체 너비를 차지 */
  padding: 10px;
  margin: 10px 10px;
  box-sizing: border-box;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #e1e1e1;
  color: #413F42;
}

.required {
  color: #F60F0F; /* 필수 입력 사항 색상 */
  margin-right: 5px; /* 입력 필드와의 간격 */
}

.delete-button {
  width: 90%;
  padding: 10px;
  margin-top: 20px;
  background-color: #024CAA;
  color: white;
  text-align: center;
  cursor: pointer;
  font-weight: bold;
  border-radius: 8px;
}
.add-button img,
.remove-button img {
  width: 24px;
  height: 24px;
}

input[type="date"] {
  position: relative;
  padding-right: 10px;
  background: url("@/assets/images/icons/calender.png") no-repeat right 10px center / 25px auto, #fff;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  color: transparent;
  cursor: pointer;
}
input[type="date"]::before {
  content: attr(data-placeholder);
  width: 100%;
}
input[type="date"]:valid::before {
  display: none;
}

.image-register-button {
  padding: 0 15px; /* 상하 패딩을 0으로 설정 */
  background-color: #024CAA; /* 버튼 배경색 */
  color: white; /* 글자색 */
  border: none; /* 테두리 없앰 */
  border-radius: 8px; /* 버튼 모서리 둥글게 */
  cursor: pointer; /* 커서 포인터로 변경 */
  margin-left: 10px; /* 아이디 입력 필드와 버튼 간격 */
  font-size: 14px; /* 글자 크기 */
  height: 40px; /* 버튼 높이를 아이디 입력 필드와 동일하게 설정 */
  white-space: nowrap; /* 텍스트가 줄 바꿈되지 않도록 설정 */
  margin-right: 10px;
}
</style>