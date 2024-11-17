<script>
import {ref, computed, onMounted} from "vue";
import { formatDate1 } from "@/utils/format";
import { ROUTES } from "@/router/routes";
import { useRoute, useRouter } from "vue-router";
import TwoButtonModal from '@/components/TwoButtonModal.vue';
import handleApiCall from '@/api/apiService';
import {fetchMyPostingDetail} from "@/api/services/corporateUserService";

export default {
  name: "JobPostingDetail",
  components: { TwoButtonModal },
  computed: {
    ROUTES() {
      return ROUTES;
    }
  },
  setup() {
    const route = useRoute();
    const postId = route.params.id
    const isDelete = route.query.delete
    console.log(postId);
    const router = useRouter();

    const modalPopupStatue = ref(false);
    const modalMessage = ref('');

    const formattedStartDate = computed(() =>
        startDate.value ? formatDate1(new Date(startDate.value)) : "-"
    );
    const formattedEndDate = computed(() =>
        endDate.value ? formatDate1(new Date(endDate.value)) : "-"
    );
    const jobposting = ref({
      entName: "",
      postTitle: "",
      postImg: "",
      startDate: "",
      endDate: "",
      jobName: "",
      entAddr1: "",
      entAddr2: ""
    });

    const jobPostingDetail = ref("");
    const postImg = ref(null);

    // 기본값 초기화 (API 데이터 로드 전까지 표시)
    const entName = ref("");
    const postTitle = ref("");
    const jobName = ref("");
    const startDate = ref(null);
    const endDate = ref(null);
    const entAddr1 = ref("");
    const entAddr2 = ref("");

    const showDeleteModal = ref(false);

    const onApplyClick = (postId) => {
      console.log("postId:", postId);
    };

    const onDeletedClick = () => {
      modalMessage.value = "채용공고를 삭제하시겠습니까?";
      showDeleteModal.value = true;
    };

    const confirmDelete = async () => {
      try {
        const response = await handleApiCall('post', '/admin/jobposting/delete', null, {
          params: { postId: postId },
          headers: {
            'Content-Type': 'application/json',
          }
        });
        console.log("삭제 결과:", response);

        closeModal(true);

      } catch (error) {
        console.error("채용공고를 삭제하지 못했습니다. 다시 시도해 주세요.", error);
      }
    };

    const closeModal = (shouldRedirect = false) => {
      showDeleteModal.value = false;
      if (shouldRedirect) {
        router.push(ROUTES.CORPORATE_JOB_POSTING_MANAGEMENT.path);
      }
    };

    // API 호출 함수
    const fetchJobDetail = async (postId) => {
      try {
        console.debug("Fetching job postings");
        const response = await fetchMyPostingDetail(postId);
        console.debug("API Response:", response);
        // API 응답 데이터 매핑
          const detail = response.data;
          entName.value = detail.entName;
          postTitle.value = detail.postTitle;
          jobName.value = detail.jobName;
          startDate.value = detail.startDate;
          endDate.value = detail.endDate;
          entAddr1.value = detail.entAddr1;
          entAddr2.value = detail.entAddr2;
          postImg.value = detail.postImg || require("@/assets/images/logo/company_sample.png");

      } catch (error) {
        console.error("[fetchJobDetail] Error:", error);
        jobPostingDetail.value = null;
      }
    };

    onMounted(() => {
      fetchJobDetail(postId);
    });


    return {
      entName,
      postTitle,
      postImg,
      jobName,
      showDeleteModal,
      modalMessage,
      modalPopupStatue,
      formattedStartDate,
      formattedEndDate,
      entAddr1,
      entAddr2,
      isDelete,
      postId,
      jobposting,
      onApplyClick,
      onDeletedClick,
      confirmDelete,
      closeModal
    };
  }
}
</script>

<template>
  <main class="job-posting-detail">
    <div class="job-posting-header">채용공고 상세페이지</div>
    <div class="job-posting-content">
      <div class="company-logo">
        <img :src="postImg" alt="Company Logo">
      </div>
      <div class="job-posting-info">
        <div class="company-name">{{ entName }}</div>
        <div class="job-title">{{ postTitle }}</div>
        <div class="job-name"> {{ jobName }} 직무 </div>
        <div class="application-period">공고 게시 및 서류 접수</div>
        <div class="application-dates">{{ formattedStartDate }} ~ {{ formattedEndDate }}</div>
        <div class="company-address-label">기업 주소</div>
        <div class="company-address">{{ entAddr1 }} {{ entAddr2 }}</div>
      </div>
    </div>
    <div class="delete-button" v-if="!isDelete" @click="onApplyClick(postId)">지원하기</div>
    <div class="delete-button" v-else @click="onDeletedClick(postId)">삭제하기</div>

    <TwoButtonModal v-if="showDeleteModal" :modal-message="modalMessage" leftButtonText="확인" rightButtonText="취소"
      @close-modal="closeModal" @confirm="confirmDelete" />
  </main>
  <modal-popup v-if="modalPopupStatue" @close-modal="closeModal" :modal-message="modalMessage"
    :router-path="ROUTES.WISDOM_MANAGEMENT.path" />
</template>

<style scoped>
.job-posting-detail {
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f8f9fa;
  overflow-y: auto;
}

.job-posting-header {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.job-posting-content {
  display: flex;
  flex-direction: column;
}

.company-logo {
  height: 300px;
  border-radius: 10px 10px 0 0;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f1f1f1;
}

.company-logo img {
  max-height: 100%;
  max-width: 100%;
}

.job-posting-info {
  padding: 20px;
  margin-top: 30px;
  border-left: 2px solid #ccc;
}

.job-posting-info div {
  margin-bottom: 10px;
}

.company-name {
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 5px;
}

.job-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.job-name {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.application-period {
  font-size: 18px;
  margin-top: 20px;
  margin-bottom: 5px;
  font-weight: bold;
}

.application-dates {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
}

.company-address-label {
  font-size: 18px;
  margin-top: 20px;
  font-weight: bold;
}

.company-address {
  font-size: 18px;
  color: #333;
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