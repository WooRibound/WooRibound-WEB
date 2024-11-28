<script>
import {onMounted, ref} from "vue";
import TwoButtonModal from "@/components/TwoButtonModal.vue";
import {ROUTES} from "@/router/routes";
import {useRoute, useRouter} from "vue-router";
import {formatDate3} from "@/utils/formatters";
import {deleteJobPostingByAdmin, fetchJobPostingDetail} from "@/api/services/adminServiece";
import SingleButtonModal from "@/components/SingleButtonModal.vue";

export default {
  name: "AdminCorporateJobPostingDetail",
  components: {SingleButtonModal, TwoButtonModal },
  computed: {
    ROUTES() {
      return ROUTES;
    }
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const postId = route.params.postId;
    const singleModalPopupStatue = ref('');
    const singleButtonModalMessage = ref('');
    const singleButtonModalRoute = ref('');
    const showDeleteModal = ref(false);
    const modalMessage = ref('');

    const jobPosting = ref({
      entName: "",
      postTitle: "",
      postImg: "",
      startDate: "",
      endDate: "",
      jobName: "",
      entAddr1: "",
      entAddr2: ""
    });

    const fetchJobPosting = async () => {
      try {
        const response = await fetchJobPostingDetail(postId);
        jobPosting.value = {
          entName: response.entName,
          postTitle: response.postTitle,
          postImg: response.postImg,
          startDate: formatDate3(response.startDate),
          endDate: formatDate3(response.endDate),
          jobName: response.jobName,
          entAddr1: response.entAddr1,
          entAddr2: response.entAddr2,
          postingCnt: response.postingCnt,
        };
      } catch (error) {
        console.error("채용공고 상세 내용을 불러오지 못했습니다. 다시 시도해 주세요.", error);
        router.push({ name: "NotFound" });
      }

    };

    onMounted(() => {
      fetchJobPosting();
    });

    const onDeleteClick = async () => {
        modalMessage.value = "채용공고를 삭제하시겠습니까?";
        showDeleteModal.value = true;
    }

    const confirmDelete = async () => {
      try {
        const response = await deleteJobPostingByAdmin(postId);
        singleButtonModalMessage.value = response;
        singleButtonModalRoute.value = ROUTES.CORPORATE_JOB_POSTING_MANAGEMENT.path
        singleModalPopupStatue.value = true;
      } catch (error) {
        console.error("채용공고를 삭제하지 못했습니다. 다시 시도해 주세요.", error);
      }
    };

    return {
      singleModalPopupStatue,
      singleButtonModalMessage,
      singleButtonModalRoute,
      showDeleteModal,
      modalMessage,
      postId,
      jobPosting,
      confirmDelete,
      onDeleteClick,
    };
  }
}
</script>

<template>
  <main class="job-posting-detail">
    <div class="job-posting-header-container">
      <div class="job-posting-header">채용공고 상세페이지</div>
      <div class="post-count">
        조회 {{ jobPosting.postingCnt }}
      </div>
    </div>
    <div class="job-posting-content">
      <div class="company-logo">
        <img :src="jobPosting.postImg" alt="Company Logo">
      </div>
      <div class="job-posting-info">
        <div class="job-posting-title">{{ jobPosting.postTitle }}</div>
        <div class="company-name">{{ jobPosting.entName }}</div>
        <div class="info-item">
          <span class="label">
            <img src="@/assets/images/icons/job.png" alt="Job Icon" class="icon" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 4px;" />
            직무 </span><br>
          <span class="aligned-label"> {{ jobPosting.jobName }}</span>
        </div>
        <div class="info-item">
          <span class="label">
            <img src="@/assets/images/icons/clock.png" alt="Job Icon" class="icon" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 4px;" />
            모집기간 </span><br>
          <span class="aligned-label"> {{ jobPosting.startDate }} ~ {{ jobPosting.endDate }}</span>
        </div>
        <div class="info-item">
          <span class="label">
            <img src="@/assets/images/icons/address.png" alt="Job Icon" class="icon" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 4px;" />
            기업주소 </span><br>
          <span class="aligned-label"> {{ jobPosting.entAddr1 }} {{ jobPosting.entAddr2 }}</span>
        </div>
      </div>
    </div>
    <div class="delete-button" @click="onDeleteClick(postId)">삭제하기</div>
  </main>
  <single-button-modal
      v-if="singleModalPopupStatue"
      @close-modal="singleModalPopupStatue = false"
      :modal-message="singleButtonModalMessage"
      :router-path="singleButtonModalRoute"
  />
  <TwoButtonModal
      v-if="showDeleteModal"
      :modal-message="modalMessage"
      leftButtonText="확인"
      rightButtonText="취소"
      @close-modal="showDeleteModal = false"
      @confirm="confirmDelete"
  />
</template>

<style scoped>
.job-posting-detail {
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f8f9fa;
  overflow-y: auto;
}

.job-posting-header-container {
  display: flex;
  justify-content: space-between; /* 좌우 정렬 */
  align-items: center; /* 수직 정렬 */
  margin-bottom: 20px;
}

.job-posting-header {
  font-size: 24px;
  font-weight: bold;
}

.post-count {
  font-size: 14px;
  color: #555555;
  display: flex;
  align-items: center;
  margin-right: 7px;
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
  margin-bottom: 17px;
}

.delete-button {
  width: 90%;
  max-width: 400px;
  padding: 10px;
  margin: 20px auto 0 auto;
  background-color: #024CAA;
  color: white;
  text-align: center;
  cursor: pointer;
  font-weight: bold;
  border-radius: 8px;
}

.label {
  display: inline-block;
  width: 90px; /* 라벨 넓이 설정으로 직무, 모집기간, 기업주소 일치 */
  font-weight: bold;
}

.company-name {
  font-size: 17px;
  font-weight: bold;
  margin-bottom: 5px;
}

.job-posting-title {
  font-size: 25px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 5px;
}

.aligned-label {
  font-size: 11pt;
  margin-left: 25px;
}
</style>