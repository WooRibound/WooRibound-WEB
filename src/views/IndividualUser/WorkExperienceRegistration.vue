<script>
import AICommendationModal from "@/components/AICommendationModal.vue";
import {computed, ref} from "vue";
import ModalPopup from "@/components/SingleButtonModal.vue";
import {ROUTES} from "@/router/routes";
import {insertWisdomShare} from "@/api/services/individualUserService";
import {useJobStore} from "@/stores/useJobStore";

export default {
  name: "WorkExperienceRegistration",
  computed: {
    ROUTES() {
      return ROUTES
    }
  },
  components: {ModalPopup, AICommendationModal},
  setup() {
    const jobStore = useJobStore();

    const modalPopupStatue = ref(false);
    const aiModalPopupStatue = ref(false);
    const modalMessage = ref('');
    const errorMessage = ref('');
    const jobs = computed(() => jobStore.getJobs);

    const knowhowJob = ref('');
    const knowhowTitle = ref('');
    const knowhowContent = ref('');
    const knowhowJobSelect = ref(null);
    const knowhowTitleSelect = ref(null);
    const knowhowContentSelect = ref(null);

    const onAIRecommendationClick = () => {
      aiModalPopupStatue.value = true;
    }

    const onRegisterClick = async () => {
      errorMessage.value = "";

      if (!knowhowJob.value) {
        errorMessage.value = "직종을 선택해주세요";
        knowhowJobSelect.value.focus();
        return;
      }

      if (!knowhowTitle.value) {
        errorMessage.value = "제목을 입력해주세요";
        knowhowTitleSelect.value.focus();
        return;
      }

      if (!knowhowContent.value) {
        errorMessage.value = "내용 입력해주세요";
        knowhowContentSelect.value.focus();
        return;
      }

      const wisdomShare = {
        knowhowJob: knowhowJob.value,
        knowhowTitle: knowhowTitle.value,
        knowhowContent: knowhowContent.value,
      };

      try {
        const response = await insertWisdomShare(wisdomShare);
        modalMessage.value = response;
        modalPopupStatue.value = true;
      } catch (error) {
        console.error('Error data:', error);
        modalMessage.value = "오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
        modalPopupStatue.value = true;
        throw error;
      }

    }

    const updateDescriptionFromAI = (gptResponse) => {
      knowhowContent.value = "";
      knowhowContent.value = gptResponse;
    };


    return {
      modalPopupStatue,
      aiModalPopupStatue,
      modalMessage,
      errorMessage,
      jobs,
      knowhowJob,
      knowhowTitle,
      knowhowContent,
      knowhowJobSelect,
      knowhowTitleSelect,
      knowhowContentSelect,
      onAIRecommendationClick,
      onRegisterClick,
      updateDescriptionFromAI,
    };
  }
}
</script>

<template>
  <main class="body">
    <div class="header">
      <div class="header-title">일경험 공유하기</div>
      <div class="header-register-job" @click="onAIRecommendationClick">글쓰기 도움 받기</div>
    </div>
    <div class="content">
      <!-- 직종 선택 -->
      <div class="input-label">
        <select class="input-field" aria-label="직종" v-model="knowhowJob" ref="knowhowJobSelect">
          <option value="" disabled selected>직무</option>
          <option v-for="job in jobs" :key="job.jobId" :value="job.jobName">{{ job.jobName }}</option>
        </select>
      </div>
      <!-- 제목 입력 -->
      <div class="input-section">
        <div class="input-label">
          <input v-model="knowhowTitle" class="input-field" placeholder="제목을 입력해주세요" ref="knowhowTitleSelect">
        </div>
      </div>
      <!-- 내용 입력 -->
      <div class="input-label">
        <!--        <textarea v-model="knowhowContent" class="textarea-field" placeholder="오른쪽 상단의 '글쓰기 도움 받기' 버튼을 클릭해 손쉽게 직무 경험을 공유해보세요." ref="knowhowContentSelect"/>-->
        <textarea
            v-model="knowhowContent"
            class="textarea-field"
            placeholder="오른쪽 상단의 '글쓰기 도움 받기' 버튼을 클릭해 손쉽게 직무 경험을 공유해보세요."
            ref="knowhowContentSelect">
        </textarea>
      </div>
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      <div class="delete-button" @click="onRegisterClick">등록하기</div>
    </div>
  </main>
  <modal-popup
      v-if="modalPopupStatue"
      @close-modal="modalPopupStatue = false"
      :modal-message="modalMessage"
      :router-path="ROUTES.WORK_EXPERIENCE_SHARING.path"
  />
  <a-i-commendation-modal
      v-if="aiModalPopupStatue"
      @close-modal="aiModalPopupStatue = false"
      @receive-gpt-response="updateDescriptionFromAI"
  />
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
  display: flex;
  justify-content: space-between; /* 두 요소를 양 끝에 배치 */
  align-items: center; /* 세로 정렬을 가운데로 */
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.header-register-job {
  background-color: #024CAA; /* 버튼 배경색 */
  color: white; /* 버튼 텍스트 색 */
  padding: 10px 15px; /* 여백 */
  border-radius: 5px; /* 모서리 둥글게 */
  cursor: pointer; /* 포인터 커서 */
  transition: background-color 0.3s; /* 호버 효과를 위한 전환 */
  font-size: 10pt;
}

.header-register-job:hover {
  background-color: #0056b3; /* 호버 시 배경색 변경 */
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.input-section {
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
}

.input-label {
  display: flex;
  align-items: center;
  width: 100%;
}

.input-field {
  width: 100%;
  padding: 10px;
  margin: 10px 10px 10px 0; /* 오른쪽 여백 추가 */
  box-sizing: border-box;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #e1e1e1;
  color: #413F42;
}

.textarea-field {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  box-sizing: border-box;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #e1e1e1;
  color: #413F42;
  resize: vertical;
  min-height: 250px;
}

.textarea-field::placeholder {
  color: #6c757d; /* 원하는 색상 */
  font-size: 16px; /* 적절한 폰트 크기 */
  opacity: 1; /* placeholder의 가시성 */
  font-family: "Pretendard";
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

.error-message {
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 10px;
  margin: 10px 0;
  width: 90%;
  text-align: center;
  white-space: pre-line; /* 줄바꿈을 위해 추가 */
}
</style>