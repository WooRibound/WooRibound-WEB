<script>
import {onMounted, ref} from "vue";
import {ROUTES} from "@/router/routes";
import {useRoute, useRouter} from "vue-router";
import {fetchWisdomDetail, insertWisdomReport} from "@/api/services/individualUserService";
import {formatDate2} from "../../utils/formatters";
import SingleButtonModal from "@/components/SingleButtonModal.vue";

export default {
  name: "WorkExperienceSharingDetail",
  components: { SingleButtonModal },
  methods: { formatDate2 },
  computed: {
    ROUTES() {
      return ROUTES
    }
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const wisdomId = route.params.id;

    const modalPopupStatue = ref(false);
    const modalMessage = ref('');
    const modalRouterPath = ref('');

    const reportedCnt = ref(0);
    const userFullId = ref('');
    const userFullName = ref('');

    const onReportClick = async (wisdom) => {
      try {
        const response = await insertWisdomReport(wisdom);
        modalMessage.value = response;
        modalPopupStatue.value  = true;
        if (response === "본인이 작성한 글은 신고할 수 없습니다.") {
          modalRouterPath.value = "";
        } else {
          modalRouterPath.value = ROUTES.WORK_EXPERIENCE_SHARING.path;
        }

      } catch (e) {
        console.log(e);
        modalMessage.value = "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
        modalPopupStatue.value  = true;
      }
    }

    const wisdom = ref({
      userName: "",
      knowhowId: "",
      knowhowJob: "",
      knowhowTitle: "",
      knowhowContent: "",
    })

    const fetchWisdom = async () => {
      try {
        const response = await fetchWisdomDetail(wisdomId);
        wisdom.value = {
          userName: response.userName,
          knowhowId: response.knowhowId,
          knowhowJob: response.knowhowJob,
          knowhowTitle: response.knowhowTitle,
          knowhowContent: response.knowhowContent,
          uploadDate: response.uploadDate,
        };

      } catch (error) {
        console.error("지혜 상세 내용을 불러오지 못했습니다. 다시 시도해 주세요.", error);
        router.push({ name: "NotFound" });
      }
    }

    onMounted(() => {
      fetchWisdom();
    });

    return {
      modalPopupStatue,
      modalMessage,
      modalRouterPath,
      wisdom,
      reportedCnt,
      userFullId,
      userFullName,
      onReportClick,
    };
  }
}
</script>

<template>
  <main class="body">
    <div class="header">
      <div class="header-title">일경험 공유하기</div>
      <div class="report-container" v-if="!isDelete" @click="onReportClick(wisdom)">
        <img src="@/assets/images/icons/siren.png" alt="신고 아이콘">
        신고하기
      </div>
      <div class="report-container" v-if="isDelete" @click="onReportClick(wisdom)">
        <img src="@/assets/images/icons/siren.png" alt="신고 아이콘">
        신고 {{ reportedCnt }}회
      </div>
    </div>
    <div class="author-info">
      <div class="author">
        작성자:
        <span v-if="!isDelete">{{ wisdom.userName }}</span>
        <span v-else>{{ userFullId }} ({{ userFullName }})</span>
      </div>
      <div class="date">{{ formatDate2(wisdom.uploadDate) }}</div>
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
        <textarea class="textarea-field" placeholder="" v-model="wisdom.knowhowContent" readonly />
      </div>
    </div>
    <div class="delete-button" v-if="isDelete" @click="onDeletePostClick(wisdom.knowhowId)">삭제하기</div>
  </main>
  <single-button-modal
      v-if="modalPopupStatue"
      :modal-message="modalMessage"
      @close-modal="modalPopupStatue = false"
      :router-path="modalRouterPath"
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
  justify-content: space-between;
  /* 두 요소를 양 끝에 배치 */
  align-items: center;
  /* 세로 정렬을 가운데로 */
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.author-info {
  display: flex;
  /* Flexbox 사용 */
  justify-content: space-between;
  /* 두 요소를 수평으로 나란히 배치 */
  align-items: center;
  /* 세로 정렬 */
  margin-bottom: 15px;
  /* Author info section margin */
  font-size: 13px;
  /* Font size for both author and date */
  color: #413F42;
  /* Color for the text */
}

.author {
  font-weight: bold;
  /* Bold for the author's name */
  margin-left: 6px;
}

.date {
  color: #999;
  /* Lighter color for the date */
  margin-right: 8px;
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
  margin: 10px 10px 10px 0;
  /* 오른쪽 여백 추가 */
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

.report-container {
  display: flex;
  align-items: center;
  /* 아이콘과 텍스트를 수직 정렬 */
  cursor: pointer;
  /* 마우스 커서를 포인터로 변경 */
  color: #FF4545;
  /* 링크 색상 변경 */
  font-size: 16px;
  /* 글자 크기 설정 */
  border-radius: 8px;
  /* 둥근 모서리 */
  padding: 5px 10px;
  /* 패딩 추가 */
  transition: background-color 0.3s, color 0.3s;
  /* 호버 효과 추가 */
}

.report-container:hover {
  background-color: #FF4545;
  /* 호버 시 배경색 변경 */
  color: white;
  /* 호버 시 텍스트 색상 변경 */
}

.report-container img {
  margin-right: 5px;
  /* 아이콘과 텍스트 사이 여백 추가 */
  width: 18px;
  /* 아이콘 크기 조정 */
  height: auto;
  /* 비율 유지 */
  margin-bottom: 5px;
}

.delete-button {
  width: 90%;
  max-width: 400px;
  padding: 10px;
  margin: 20px auto 0 auto;
  /* 가운데 정렬을 위한 속성 추가 */
  background-color: #024CAA;
  color: white;
  text-align: center;
  cursor: pointer;
  font-weight: bold;
  border-radius: 8px;
}
</style>