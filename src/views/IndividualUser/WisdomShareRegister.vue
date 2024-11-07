<script>
import AICommendationModal from "@/components/AICommendationModal.vue";
import {onMounted, ref} from "vue";
import ModalPopup from "@/components/SingleButtonModal.vue";
import {ROUTES} from "@/router/routes";
import { fetchJobs } from '@/api/services/globalServiece'

export default {
  name: "WisdomShareRegister",
  computed: {
    ROUTES() {
      return ROUTES
    }
  },
  components: {ModalPopup, AICommendationModal},
  setup() {
    const modalPopupStatue = ref(false);
    const aiModalPopupStatue = ref(false);

    const jobs = ref([]);
    const jobTitle = ref(''); // 제목 입력을 위한 ref
    const jobDescription = ref(''); // 내용 입력을 위한 ref

    const loadJobs = async () => {
      try {
        const response = await fetchJobs();
        jobs.value = response;
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    onMounted(() => {
      loadJobs();
    });

    const onAIRecommendationClick = () => {
      console.log("ai 추천");
      aiModalPopupStatue.value = true;
    }

    const onRegisterClick = () => {
      modalPopupStatue.value = true;
    }

    const updateDescriptionFromAI = (gptResponse) => {
      jobDescription.value = "";
      jobDescription.value = gptResponse;
    };


    return {
      jobs,
      jobTitle,
      jobDescription,
      modalPopupStatue,
      aiModalPopupStatue,
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
      <div class="header-title">지혜 나눔</div>
      <div class="header-register-job" @click="onAIRecommendationClick">AI 작성</div>
    </div>
    <div class="content">
      <!-- 직종 선택 -->
      <div class="input-label">
        <select class="input-field" aria-label="산업">
          <option value="" disabled selected>산업</option>
          <option v-for="job in jobs" :key="job.jobId" :value="job.jobId">{{ job.jobName }}</option>
        </select>
      </div>
      <!-- 제목 입력 -->
      <div class="input-section">
        <div class="input-label">
          <input v-model="jobTitle" class="input-field" placeholder="제목을 입력해주세요">
        </div>
      </div>
      <!-- 내용 입력 -->
      <div class="input-label">
        <textarea v-model="jobDescription" class="textarea-field" placeholder="" />
      </div>
      <div class="delete-button" @click="onRegisterClick">등록하기</div>
    </div>
  </main>
  <modal-popup
      v-if="modalPopupStatue"
      @close-modal="modalPopupStatue = false"
      :modal-message="'지혜 나눔 수정이 완료되었습니다.'"
      :router-path="ROUTES.WISDOM_SHARE.path"
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
  height: 100%;
}

.input-section {
  display: flex;
  flex-direction: column;
  align-items: center;
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
</style>