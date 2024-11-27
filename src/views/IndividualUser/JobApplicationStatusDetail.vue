<script>
import {onMounted, ref} from "vue";
import {formatDate3} from "@/utils/formatters";
import {ROUTES} from "@/router/routes";
import {useRoute} from "vue-router";
import TwoButtonModal from '@/components/TwoButtonModal.vue';
import {deleteUserApply, fetchJobApplyDetail} from "@/api/services/individualUserService";
import SingleButtonModal from "@/components/SingleButtonModal.vue";
import {APPLY_TYPES} from "@/constants/applyTypes";

export default {
  name: "JobApplicationStatusDetail",
  components: {SingleButtonModal, TwoButtonModal },
  computed: {
    APPLY_TYPES() {
      return APPLY_TYPES
    },
    ROUTES() {
      return ROUTES;
    }
  },
  setup() {
    const route = useRoute();
    const applyId = route.params.applyId;

    const singleModalPopupStatue = ref(false);
    const twoButtonModalPopupStatue = ref(false);
    const singleButtonModalMessage = ref('');
    const twoButtonModalMessage = ref('');
    const singleButtonModalRoute = ref('');
    const twoButtonModalRoute = ref('');
    const isApplicationOpened = ref(false);
    const isApplicationClosed = ref(false);

    const userApplyDetail = ref({
      result: '',
      postId: null,
      postTitle: '',
      postImg: '',
      jobName: '',
      startDate: '',
      endDate: '',
      entName: '',
      entAddr1: '',
      pentAddr2: '',
    });

    const fetchJobPosting = async () => {
      try {
        const response = await fetchJobApplyDetail(applyId);
        userApplyDetail.value = {
          result: response.result,
          postId: response.postId,
          postTitle: response.postTitle,
          postImg: response.postImg,
          jobName: response.jobName,
          startDate: formatDate3(response.startDate),
          endDate: formatDate3(response.endDate),
          entName: response.entName,
          entAddr1: response.entAddr1,
          entAddr2: response.entAddr2,
        };

        const today = new Date();
        const startDate = new Date(response.startDate);
        const endDate = new Date(response.endDate);

        isApplicationOpened.value = today >= startDate && today <= endDate;
        isApplicationClosed.value = today > endDate;

      } catch (error) {
        console.error("채용공고 상세 내용을 불러오지 못했습니다. 다시 시도해 주세요.", error);
      }

    };

    onMounted(() => {
      fetchJobPosting();

    });


    const onApplyCancelClick = () => {
      twoButtonModalMessage.value = '정말로 지원을 취소하시겠습니까?';
      twoButtonModalRoute.value = '';
      twoButtonModalPopupStatue.value = true;
    }

    const deleteJobPostingApplyCancel = async (applyId) => {
      try {
        const response = await deleteUserApply(applyId);
        singleButtonModalMessage.value = response;
        singleButtonModalRoute.value = ROUTES.JOB_APPLICATION_STATUS.path;
        singleModalPopupStatue.value = true;
      } catch (e) {
        console.log(e);
        singleButtonModalMessage.value = '오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
        singleButtonModalRoute.value = '';
        singleModalPopupStatue.value = true;

      }
    }

    return {
      singleModalPopupStatue,
      twoButtonModalPopupStatue,
      singleButtonModalMessage,
      twoButtonModalMessage,
      singleButtonModalRoute,
      twoButtonModalRoute,
      applyId,
      userApplyDetail,
      isApplicationOpened,
      isApplicationClosed,
      onApplyCancelClick,
      deleteJobPostingApplyCancel,
    };
  }
};
</script>

<template>
  <main class="job-posting-detail">
    <div class="job-posting-header">지원 현황</div>
    <div class="job-posting-subtitle">채용공고 상세페이지</div>
    <div class="job-posting-content">
      <div class="company-logo">
        <img :src="userApplyDetail.postImg" alt="Company Logo">
      </div>
      <div class="job-posting-info">
        <div class="job-posting-title">{{ userApplyDetail.postTitle }}</div>
        <div class="company-name">{{ userApplyDetail.entName }}</div>
        <div class="info-item">
          <span class="label">
            <img src="@/assets/images/icons/job.png" alt="Job Icon" class="icon" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 4px;" />
            직무 </span><br>
          <span class="aligned-label"> {{ userApplyDetail.jobName }}</span>
        </div>
        <div class="info-item">
          <span class="label">
            <img src="@/assets/images/icons/clock.png" alt="Job Icon" class="icon" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 4px;" />
            모집기간 </span><br>
          <span class="aligned-label"> {{ userApplyDetail.startDate }} ~ {{ userApplyDetail.endDate }}</span>
        </div>
        <div class="info-item">
          <span class="label">
            <img src="@/assets/images/icons/address.png" alt="Job Icon" class="icon" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 4px;" />
            기업주소 </span><br>
          <span class="aligned-label">  {{ userApplyDetail.entAddr1 }} {{ userApplyDetail.entAddr2 }}</span>
        </div>
      </div>
    </div>
    <div v-if="isApplicationClosed" class="not-application-date-button">접수 마감</div>
    <div v-else-if="userApplyDetail.result === APPLY_TYPES.PENDING" class="apply-cancel-button" @click="onApplyCancelClick(applyId)">지원 취소</div>
    <div v-else-if="userApplyDetail.result === APPLY_TYPES.CANCELED" class="not-application-date-button">지원 취소된 공고</div>
  </main>
  <single-button-modal
      v-if="singleModalPopupStatue"
      @close-modal="singleModalPopupStatue = false"
      :modal-message="singleButtonModalMessage"
      :router-path="singleButtonModalRoute"
  />
  <TwoButtonModal
      v-if="twoButtonModalPopupStatue"
      @confirm="deleteJobPostingApplyCancel(applyId)"
      @close-modal="twoButtonModalPopupStatue = false"
      :modal-message="twoButtonModalMessage"
      leftButtonText="확인"
      rightButtonText="취소"
      :router-path="twoButtonModalRoute"
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

.job-posting-subtitle {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
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

.job-title {
  font-size: 18px;
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

.apply-cancel-button,
.apply-button{
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
  font-weight: 800;
  margin-bottom: 5px;
  font-size: 11pt;
}

.aligned-label {
  font-size: 11pt;
  margin-left: 25px;
}

.not-application-date-button {
  width: 90%;
  max-width: 400px;
  padding: 10px;
  border: 1px solid #d3d3d3;
  background-color: #ffffff;
  color: #808080;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
  margin: 20px auto 0 auto;
}
</style>