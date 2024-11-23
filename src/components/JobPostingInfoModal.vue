<script>
import {useRouter} from "vue-router";
import {ROUTES} from "@/router/routes";

export default {
  name: "JobPostingInfoOverlay",
  setup(props, {emit}) {
    const router = useRouter();
    const closeModal = () => {
      emit('close-modal', false);
    }

    const onLeftModalButtonClick = () => {
      router.push({
        name: ROUTES.LOGIN.name
      });

      emit('close-modal', false);
    }

    const onRightModalButtonClick = () => {
      emit('close-modal', false);
    }

    return {
      closeModal,
      onLeftModalButtonClick,
      onRightModalButtonClick,
    };
  }
}
</script>

<template>
  <div class="overlay">
    <div class="modal-content">
      <p class="modal-message">
      로그인 후에 관심 직종에 맞는 <br>
      공고를 받아보세요! 😄
      </p>
      <div class="button-wrap">
        <button class="left-modal-button" @click="onLeftModalButtonClick">로그인 하기</button>
        <button class="right-modal-button" @click="onRightModalButtonClick">다음에 할게요</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center; /* 중앙 정렬 */
  align-items: center; /* 중앙 정렬 */
  z-index: 1000;
}

.modal-content {
  background: #fff; /* 컨텐츠 박스 배경색 흰색 */
  padding: 20px; /* 내부 여백 추가 */
  border-radius: 8px; /* 모서리 둥글게 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 박스 그림자 */
  max-width: 90%; /* 화면에 맞도록 최대 너비 설정 */
  text-align: center; /* 텍스트 중앙 정렬 */
  margin-left: 10px;
  margin-right: 10px;
}

.button-wrap {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.left-modal-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #024CAA;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 130px;
}

.left-modal-button:hover {
  background-color: #003a7a;
}

.right-modal-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #E4E0E1;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 130px;
}

.right-modal-button:hover {
  background-color: #003a7a;
}
</style>
