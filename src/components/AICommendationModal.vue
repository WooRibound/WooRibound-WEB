<script>
import { ref } from 'vue';
import {getGptResponse} from "@/api/services/gptService";
import SingleButtonModal from "@/components/SingleButtonModal.vue";

export default {
  name: "AICommendationModal",
  components: {SingleButtonModal},
  setup(props, {emit}) {
    const modalStatus = ref(false);
    const userInput = ref('');

    const closeModal = () => {
      emit('close-modal', false);
    };

    const onGetGptCommentClick = async () => {

      if (!userInput.value.trim()) {
        alert("직무 경험을 입력해주세요.");
        return;
      }

      try {
        const data = await getGptResponse(userInput.value);
        emit('receive-gpt-response', data);
        closeModal();

      } catch (e) {
        console.log(e);
        modalStatus.value = true;
      }
    }

    return {
      modalStatus,
      userInput,
      closeModal,
      onGetGptCommentClick,
    };
  }
}
</script>

<template>
  <div class="modal-overlay">
    <div class="menu-content">
      <div class="menu_title">
        글쓰기 도우미
        <div class="close-button" @click="closeModal">
          <img src="@/assets/images/icons/close.png" alt="Close" />
        </div>
      </div>
      <div class="recommendation-note">
        ** 예시1 : 저는 자바 개발자로 15년 동안 근무했습니다. 주로 금융 차세대 프로젝트에 참여했고, PM 경험을 통해 인력관리와 일정관리 노하우를 습득했습니다. <br>
        <br>** 예시2 : 저는 20년차 가정주부입니다. 정리정돈 및 세탁 노하우를 주변 사람들과 블로그에 공유하는 것이 취미입니다.
      </div>
      <div class="response-section">
        <div class="input-section">
          <textarea
              v-model="userInput"
              class="comment-input"
              placeholder="여기에 작성해주세요."
          />
          <div class="submit-button" @click="onGetGptCommentClick">제출</div>
        </div>
      </div>
    </div>
  </div>
  <single-button-modal
      v-if="modalStatus"
      @close-modal="modalStatus = false"
      :modal-message="'오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'"
  />
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
  height: 75%;
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

.comment-input::placeholder {
  font-family: "Pretendard";
}

.recommendation-note {
  font-size: 15px; /* 작은 글씨 크기 */
  color: #666; /* 회색 텍스트 색상 */
  margin-bottom: 10px; /* 아래쪽 여백 추가 */
}

.comment-input {
  width: 100%;
  height: 200px; /* 높이 조정 가능 */
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  margin-bottom: 15px; /* 아래쪽 여백 추가 */
  font-size: 16px; /* 폰트 크기 조정 가능 */
}

.submit-button {
  background-color: #024CAA; /* 버튼 배경색 */
  color: white; /* 버튼 텍스트 색 */
  padding: 10px 15px; /* 여백 */
  border: none; /* 기본 테두리 제거 */
  border-radius: 5px; /* 모서리 둥글게 */
  cursor: pointer; /* 포인터 커서 */
  text-align: center;
}

.submit-button:hover {
  background-color: #0056b3; /* 호버 시 배경색 변경 */
}
</style>