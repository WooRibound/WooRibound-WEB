<script>
import {onMounted, ref} from "vue";
import {ROUTES} from "@/router/routes";
import {useRoute} from "vue-router";
import {fetchWisdomDetail} from "@/api/services/individualUserService";
import {formatDate2} from "../../utils/format";
import ModalPopup from "@/components/SingleButtonModal.vue";

export default {
  name: "WisdomExploreDetail",
  components: {ModalPopup},
  methods: {formatDate2},
  computed: {
    ROUTES() {
      return ROUTES
    }
  },
  setup() {
    const route = useRoute();
    const postId = route.params.id
    const isDelete = route.query.delete

    const modalPopupStatue = ref(false);
    const aiModalPopupStatue = ref(false);
    const modalMessage = ref('');

    const warningCount = ref(0);

    const onReportClick = () => {
      // todo API 구현 시 아래에 로직 구현 하기
      console.log("신고하기");
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
        const response = await fetchWisdomDetail(postId);
        wisdom.value = {
          userName: response.userName,
          knowhowId: response.knowhowId,
          knowhowJob: response.knowhowJob,
          knowhowTitle: response.knowhowTitle,
          knowhowContent: response.knowhowContent,
          uploadDate: response.uploadDate,
        };
      } catch (error) {
        console.error("Failed to fetch wisdom details:", error);
      }
    }

    onMounted(() => {
      fetchWisdom();
    })

    const onDeletePostClick = (knowhowId) => {
      // todo <관리자용 삭제 버튼> API 구현시 아래 로직 구현
      console.log("knowhowId:", knowhowId);
    }

    return {
      modalPopupStatue,
      isDelete,
      aiModalPopupStatue,
      modalMessage,
      wisdom,
      warningCount,
      onReportClick,
      onDeletePostClick,
    };
  }
}
</script>

<template>
  <main class="body">
    <div class="header">
      <div class="header-title">지혜 탐색</div>
      <div class="report-container" v-if="!isDelete" @click="onReportClick">
        <img src="@/assets/images/icons/siren.png" alt="신고 아이콘">
        신고하기
      </div>
      <div class="report-container" v-if="isDelete" @click="onReportClick">
        <img src="@/assets/images/icons/siren.png" alt="신고 아이콘">
        경고 {{ warningCount }}회
      </div>
    </div>
    <div class="author-info">
      <div class="author">작성자: {{ wisdom.userName }}</div>
      <div class="date">{{ formatDate2(wisdom.uploadDate)}}</div>
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
    </div>
    <div class="delete-button" v-if="isDelete" @click="onDeletePostClick(wisdom.knowhowId)">삭제하기</div>
  </main>
  <modal-popup
      v-if="modalPopupStatue"
      @close-modal="modalPopupStatue = false"
      :modal-message="modalMessage"
      :router-path="ROUTES.WISDOM_MANAGEMENT.path"
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

.author-info {
  display: flex; /* Flexbox 사용 */
  justify-content: space-between; /* 두 요소를 수평으로 나란히 배치 */
  align-items: center; /* 세로 정렬 */
  margin-bottom: 15px; /* Author info section margin */
  font-size: 13px; /* Font size for both author and date */
  color: #413F42; /* Color for the text */
}

.author {
  font-weight: bold; /* Bold for the author's name */
  margin-left: 6px;
}

.date {
  color: #999; /* Lighter color for the date */
  margin-right: 8px;
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

.report-container {
  display: flex;
  align-items: center; /* 아이콘과 텍스트를 수직 정렬 */
  cursor: pointer; /* 마우스 커서를 포인터로 변경 */
  color: #FF4545; /* 링크 색상 변경 */
  font-size: 16px; /* 글자 크기 설정 */
  border-radius: 8px; /* 둥근 모서리 */
  padding: 5px 10px; /* 패딩 추가 */
  transition: background-color 0.3s, color 0.3s; /* 호버 효과 추가 */
}

.report-container:hover {
  background-color: #FF4545; /* 호버 시 배경색 변경 */
  color: white; /* 호버 시 텍스트 색상 변경 */
}

.report-container img {
  margin-right: 5px; /* 아이콘과 텍스트 사이 여백 추가 */
  width: 18px; /* 아이콘 크기 조정 */
  height: auto; /* 비율 유지 */
  margin-bottom: 5px;
}

.delete-button {
  width: 95%;
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