<script>
import AICommendationModal from "@/components/AICommendationModal.vue";
import {onMounted, ref} from "vue";
import ModalPopup from "@/components/SingleButtonModal.vue";
import {ROUTES} from "@/router/routes";
import {useRoute} from "vue-router";
import {deleteWisdomDetail, fetchWisdomDetail} from "@/api/services/individualUserService";

export default {
  name: "MyWorkExperienceDetail",
  computed: {
    ROUTES() {
      return ROUTES
    }
  },
  components: {ModalPopup, AICommendationModal},
  setup() {
    const route = useRoute();
    const postId = route.params.id

    const modalPopupStatue = ref(false);
    const aiModalPopupStatue = ref(false);
    const modalMessage = ref('');

    const wisdom = ref({
      knowhowId: "",
      knowhowJob: "",
      knowhowTitle: "",
      knowhowContent: "",
    })

    const fetchWisdom = async () => {
      try {
        const response = await fetchWisdomDetail(postId);
        wisdom.value = {
          knowhowId: response.knowhowId,
          knowhowJob: response.knowhowJob,
          knowhowTitle: response.knowhowTitle,
          knowhowContent: response.knowhowContent,
        };
      } catch (error) {
        console.error("Failed to fetch wisdom details:", error);
      }
    }

    onMounted(() => {
      fetchWisdom();
    })

    const onDeletePostClick = async (knowhowId) => {
      try {
          const response = await deleteWisdomDetail(knowhowId);

          modalMessage.value = response;
          modalPopupStatue.value = true;
      } catch (error) {
        console.error("Failed to fetch wisdom details:", error);
      }
    }

    return {
      modalPopupStatue,
      aiModalPopupStatue,
      modalMessage,
      wisdom,
      onDeletePostClick,
    };
  }
}
</script>

<template>
  <main class="body">
    <div class="header">
      <div class="header-title">지혜 나눔</div>
    </div>
    <div class="content">
      <!-- 직종 선택 -->
      <div class="input-section">
        <div class="input-label">
          <input class="input-field" placeholder="" v-model="wisdom.knowhowJob" readonly />
        </div>
      </div>
      <!-- 제목 입력 -->
      <div class="input-section">
        <div class="input-label">
          <input class="input-field" placeholder="" v-model="wisdom.knowhowTitle" readonly />
        </div>
      </div>
      <!-- 내용 입력 -->
      <div class="input-label">
        <textarea class="textarea-field" placeholder="" v-model="wisdom.knowhowContent" readonly/>
      </div>
      <div class="delete-button" @click="onDeletePostClick(wisdom.knowhowId)">삭제하기</div>
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

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
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