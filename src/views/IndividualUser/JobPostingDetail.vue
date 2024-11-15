<script>
import {ref, onMounted} from "vue";
import { formatDate1 } from "@/utils/format";
import { ROUTES } from "@/router/routes";
import { useRoute } from "vue-router";
import TwoButtonModal from '@/components/TwoButtonModal.vue';
import {deleteUserApply, fetchJobPostingDetail, insertUserApply} from "@/api/services/individualUserService";
import SingleButtonModal from "@/components/SingleButtonModal.vue";

export default {
  name: "JobPostingDetail",
  components: {SingleButtonModal, TwoButtonModal},
  computed: {
    ROUTES() {
      return ROUTES;
    }
  },
  setup() {
    const route = useRoute();
    const applyId = route.params.applyId;
    const postId = route.params.postId;

    const singleModalPopupStatue = ref(false);
    const twoButtonModalPopupStatue = ref(false);
    const modalMessage = ref('');

    const jobPosting = ref({
      entName: '',
      postTitle: '',
      postImg: '',
      startDate: '',
      endDate: '',
      jobName: '',
      entAddr1: '',
      entAddr2: ''
    });

    const fetchJobPosting = async () => {
      try {
        const response = await fetchJobPostingDetail(applyId);
        jobPosting.value = {
          entName: response.entName,
          postTitle: response.postTitle,
          postImg: response.postImg,
          startDate: formatDate1(response.startDate),
          endDate: formatDate1(response.endDate),
          jobName: response.jobName,
          entAddr1: response.entAddr1,
          entAddr2: response.entAddr2,
        };
      } catch (error) {
        console.error("채용공고 상세 내용을 불러오지 못했습니다. 다시 시도해 주세요.", error);
      }

    };

    onMounted(() => {
      fetchJobPosting();

    });

    const onApplyClick = async (postId) => {
      try {
        const response = await insertUserApply(postId);
        modalMessage.value = response;
        singleModalPopupStatue.value = true;
      } catch (e) {
        console.log(e);
      }
    };

    const onApplyCancelClick = async (applyId) => {
      const isConfirm = confirm("정말로 삭제하시겠습니까?");
      if (isConfirm) {
        try {
          const response = await deleteUserApply(applyId);
          modalMessage.value = response;
          singleModalPopupStatue.value = true;
          console.log(response);
        } catch (e) {
          console.log(e);
        }
      }
    }


    return {
      singleModalPopupStatue,
      twoButtonModalPopupStatue,
      modalMessage,
      applyId,
      postId,
      jobPosting,
      onApplyClick,
      onApplyCancelClick,
    };
  }
};
</script>

<template>
  <main class="job-posting-detail">
    <div class="job-posting-header">채용공고 상세페이지</div>
    <div class="job-posting-content">
      <div class="company-logo">
        <img :src="jobPosting.postImg" alt="Company Logo">
      </div>
      <div class="job-posting-info">
        <div class="company-name">{{ jobPosting.entName }}</div>
        <div class="job-title">{{ jobPosting.postTitle }}</div>
        <div class="job-title">{{ jobPosting.jobName }}</div>
        <div class="application-period">공고 게시 및 서류 접수</div>
        <div class="application-dates">{{ jobPosting.startDate }} ~ {{ jobPosting.endDate }}</div>
        <div class="company-address-label">기업 주소</div>
        <div class="company-address">{{ jobPosting.entAddr1 }} {{ jobPosting.entAddr2 }}</div>
      </div>
    </div>
    <div class="delete-button" v-if="postId" @click="onApplyClick(postId)">지원하기</div>
    <div class="delete-button" v-if="applyId" @click="onApplyCancelClick(applyId)">지원취소</div>
  </main>
  <single-button-modal
      v-if="singleModalPopupStatue"
      @close-modal="singleModalPopupStatue = false"
      :modal-message="modalMessage"
      :router-path="ROUTES.JOB_APPLICATION_STATUS.path"
  />
  <TwoButtonModal
      v-if="twoButtonModalPopupStatue"
      @close-modal="twoButtonModalPopupStatue = false"
      :modal-message="modalMessage"
      leftButtonText="확인"
      rightButtonText="취소"
      :router-path="ROUTES.JOB_APPLICATION_STATUS.path"
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