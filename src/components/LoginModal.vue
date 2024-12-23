<script>
import {useLoginModalStore} from "@/stores/useLoginModalStore";
import {useRouter} from "vue-router";

export default {
  name: "LoginModal",
  setup() {
    const router = useRouter();
    const loginModalStore = useLoginModalStore();
    const onModalButtonClick  = () => {
      router.push({
        name: loginModalStore.redirectPath,
      });

      loginModalStore.closeModal();

    };

    return {
      loginModalStore,
      onModalButtonClick,
    };
  }
}
</script>

<template>
  <div class="overlay" v-if="loginModalStore.modalStatus">
    <div class="modal">
      <div class="modal-content">
        <p class="modal-message">로그인이 필요한 서비스입니다.</p>
        <button class="modal-button" @click="onModalButtonClick">확인</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  height: 150px;
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
  width: 250px;
}

.modal-button:hover {
  background-color: #003a7a; /* 호버 시 배경색 변화 */
}
</style>