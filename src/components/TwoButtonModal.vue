<script>
import { useRouter } from 'vue-router';

export default {
  name: "TwoButtonModal",
  props: {
    modalMessage: {
      type: String,
      required: true,
    },
    leftButtonText: {
      type: String,
      default: '확인', // 기본 버튼 텍스트
    },
    rightButtonText: {
      type: String,
      default: '취소', // 기본 버튼 텍스트
    },
    routerPath: {
      type: String,
    }
  },
  setup(props, { emit }) {
    const router = useRouter(); // useRouter 훅을 사용하여 라우터 인스턴스를 가져옵니다.

    const onLeftModalButtonClick = () => {
      if (props.routerPath) {
        router.push(props.routerPath); // 라우터 경로로 이동
      }
      emit('confirm');
      emit('close-modal', false);
    }

    const onRightModalButtonClick = () => {
      emit('close-modal', false);
    }

    return {
      props,
      onLeftModalButtonClick,
      onRightModalButtonClick,
    };
  }
};
</script>

<template>
  <div class="overlay">
    <div class="modal">
      <div class="modal-content">
        <p class="modal-message">{{ props.modalMessage }}</p>
        <div class="button-wrap">
          <button class="left-modal-button" @click="onLeftModalButtonClick">{{ props.leftButtonText }}</button>
          <button class="right-modal-button" @click="onRightModalButtonClick">{{ props.rightButtonText }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  /* 고정 위치 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  /* 반투명 배경 */
  display: flex;
  align-items: center;
  /* 세로 중앙 정렬 */
  justify-content: center;
  /* 가로 중앙 정렬 */
  z-index: 1000;
  /* 다른 요소들 위에 표시 */
}

.modal {
  background-color: white;
  /* 모달 배경색 */
  border-radius: 8px;
  /* 모서리 둥글게 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  /* 그림자 효과 */
  padding: 20px;
  /* 내부 여백 */
  width: 300px;
  /* 모달 너비 */
  height: 150px;
  display: flex;
  /* 플렉스 박스 사용 */
  flex-direction: column;
  /* 세로 방향 정렬 */
  justify-content: center;
  /* 세로 중앙 정렬 */
}

.modal-content {
  display: flex;
  flex-direction: column;
  /* 세로 방향 정렬 */
  align-items: center;
  /* 가로 중앙 정렬 */
}

.modal-message {
  margin-bottom: 45px;
  /* 메시지와 버튼 사이 여백 */
  text-align: center;
  /* 텍스트 중앙 정렬 */
}

.button-wrap {
  display: flex;
  /* 버튼을 수평으로 정렬 */
  gap: 10px;
  /* 버튼 간 간격 */
  justify-content: center;
  /* 버튼을 중앙 정렬 */
}


.left-modal-button {
  padding: 10px 20px;
  /* 버튼 내부 여백 */
  border: none;
  /* 기본 테두리 제거 */
  border-radius: 5px;
  /* 모서리 둥글게 */
  background-color: #024CAA;
  /* 버튼 배경색 */
  color: white;
  /* 버튼 텍스트 색상 */
  cursor: pointer;
  /* 포인터 커서로 변경 */
  transition: background-color 0.3s;
  /* 배경색 변화 애니메이션 */
  width: 130px;
}

.left-modal-button:hover {
  background-color: #003a7a;
  /* 호버 시 배경색 변화 */
}

.right-modal-button {
  padding: 10px 20px;
  /* 버튼 내부 여백 */
  border: none;
  /* 기본 테두리 제거 */
  border-radius: 5px;
  /* 모서리 둥글게 */
  background-color: #E4E0E1;
  /* 버튼 배경색 */
  color: white;
  /* 버튼 텍스트 색상 */
  cursor: pointer;
  /* 포인터 커서로 변경 */
  transition: background-color 0.3s;
  /* 배경색 변화 애니메이션 */
  width: 130px;
}

.right-modal-button:hover {
  background-color: #003a7a;
  /* 호버 시 배경색 변화 */
}
</style>
