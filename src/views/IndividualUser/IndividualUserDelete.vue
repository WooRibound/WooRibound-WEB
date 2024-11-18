<script>
import { ref } from "vue";
import { ROUTES } from "@/router/routes";
import { withdrawIndividual } from '@/api/services/authenticationService';
import {useUserStore} from "@/stores/userStore";
import router from "@/router";

export default {
  name: "IndividualUserDelete",
  computed: {
    ROUTES() {
      return ROUTES
    }
  },
  setup() {
    const confirmText = ref('');
    const errorModalStatus = ref(false);
    const REQUIRED_TEXT = '탈퇴하기';
    const isButtonEnabled = ref(false);

    const moveToSuccessPage = () => {
      router.push({
        name: ROUTES.DELETE_SUCCESS.name,
        params: {
          cat: 'individual'
        },
      })
    }

    const validateConfirmText = () => {
      isButtonEnabled.value = confirmText.value === REQUIRED_TEXT;
    };

    const onWithdraw = async () => {
      if (confirmText.value !== REQUIRED_TEXT) {
        return;
      }

      try {
        console.log("탈퇴 요청 시작");
        const response = await withdrawIndividual();
        await useUserStore().logout();
        console.log("탈퇴 API 응답:", response);
        if (response && response.status === 200) {
          console.log("탈퇴 처리 완료");
          moveToSuccessPage();
        } else {
          throw new Error('탈퇴 처리 실패');
        }
      } catch (error) {
        console.error("탈퇴 처리 중 오류 발생:", error);
        errorModalStatus.value = true;
      }
    }

    return {
      confirmText,
      errorModalStatus,
      REQUIRED_TEXT,
      isButtonEnabled,
      validateConfirmText,
      onWithdraw,
    };
  }
}
</script>

<template>
  <div class="body">
    <div class="header">개인 정보</div>
    <div class="subtitle">회원 탈퇴</div>
    <div class="content">
      <div class="warning-section">
        <div class="warning-title">⚠️ 탈퇴 전 꼭 확인해주세요!</div>
        <div class="warning-text">
          • 탈퇴 시 회원님의 모든 정보가 삭제됩니다.<br>
          • 탈퇴 후에는 현재 네이버 계정으로 다시 가입할 수 없습니다.<br>
          • 탈퇴는 취소할 수 없으며, 즉시 처리됩니다.
        </div>
      </div>
      <div class="confirm-section">
        <div class="confirm-text">계속 진행하시려면 아래에 '{{ REQUIRED_TEXT }}'를 입력하세요.</div>
        <input
            type="text"
            v-model="confirmText"
            @input="validateConfirmText"
            class="confirm-input"
            placeholder="탈퇴하기"
        />
      </div>
      <div class="button-section">
        <button
            class="delete-button"
            @click="onWithdraw"
            :disabled="!isButtonEnabled"
            :class="{ 'button-disabled': !isButtonEnabled }"
        >
          회원 탈퇴
        </button>
      </div>
    </div>
  </div>

  <!-- 에러 모달 -->
  <div v-if="errorModalStatus" class="modal-overlay">
    <div class="modal">
      <div class="modal-content">
        <p class="modal-message">탈퇴 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.</p>
        <button class="modal-button" @click="errorModalStatus = false">확인</button>
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

.subtitle {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  flex: 1;
  height: 100%;
}

.warning-section {
  width: 100%;
  max-width: 400px;
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.warning-title {
  font-size: 18px;
  font-weight: bold;
  color: #e74c3c;
  margin-bottom: 15px;
}

.warning-text {
  font-size: 15px;
  line-height: 1.6;
  color: #555;
}

.confirm-section {
  width: 100%;
  max-width: 400px;
  margin-bottom: 30px;
  text-align: center;
}

.confirm-text {
  font-size: 16px;
  color: #333;
  margin-bottom: 15px;
}

.confirm-input {
  width: 100%;
  max-width: 300px;
  padding: 12px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.3s;
}

.confirm-input:focus {
  border-color: #024CAA;
}

.button-section {
  width: 100%;
  max-width: 300px;
  display: flex;
  justify-content: center;
}

.delete-button {
  width: 95%;
  padding: 15px;
  background-color: #024CAA;
  color: white;
  text-align: center;
  cursor: pointer;
  font-weight: bold;
  border-radius: 8px;
  border: none;
  transition: background-color 0.2s;
}

.delete-button:hover:not(.button-disabled) {
  background-color: #023c85;
}

.button-disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  width: 300px;
  text-align: center;
}

.modal-message {
  margin-bottom: 20px;
  color: #333;
}

.modal-button {
  padding: 10px 20px;
  background-color: #024CAA;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.modal-button:hover {
  background-color: #023c85;
}
</style>