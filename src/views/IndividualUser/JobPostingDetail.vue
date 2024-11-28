<script>
import {onMounted, ref} from "vue";
import {formatDate3} from "@/utils/formatters";
import {ROUTES} from "@/router/routes";
import {useRoute} from "vue-router";
import {fetchJobPostingDetail, insertUserApply} from "@/api/services/individualUserService";
import {useUserStore} from "@/stores/userStore";
import SingleButtonModal from "@/components/SingleButtonModal.vue";

export default {
  name: "JobPostingDetail",
  components: {SingleButtonModal },
  computed: {
    ROUTES() {
      return ROUTES;
    }
  },
  setup() {
    const route = useRoute();
    const userStore = useUserStore();
    const postId = route.params.postId;

    const singleModalPopupStatue = ref(false);
    const singleButtonModalMessage = ref('');
    const singleButtonModalRoute = ref('');
    const isApplicationOpened = ref(false);
    const isApplicationClosed = ref(false);

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
      fetchJobPosting(postId);

    });

    const onApplyClick = async (postId) => {
      if (!userStore.isLoggedIn) {
        singleButtonModalMessage.value = '로그인 후 이용해주세요.';
        singleButtonModalRoute.value = '';
        singleModalPopupStatue.value = true;
        return;
      }

      try {
        const response = await insertUserApply(postId);

        singleButtonModalMessage.value = response;
        if (singleButtonModalMessage.value === '이력서를 등록하고 지원해주세요.') {
          singleButtonModalRoute.value = ROUTES.RESUME_PAGE.path;
        } else {
          singleButtonModalRoute.value = ROUTES.JOB_APPLICATION_STATUS.path;
        }
        singleModalPopupStatue.value = true;
      } catch (e) {
        console.log(e);
      }
    };

    return {
      singleModalPopupStatue,
      singleButtonModalMessage,
      singleButtonModalRoute,
      postId,
      jobPosting,
      isApplicationOpened,
      isApplicationClosed,
      onApplyClick,
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
    <div v-if="isApplicationClosed" class="not-application-date-button">접수 마감</div>
    <div v-else-if="postId && isApplicationOpened" class="apply-button" @click="onApplyClick(postId)">지원 접수</div>
    <div v-else-if="postId && !isApplicationOpened" class="not-application-date-button">접수 예정</div>
  </main>
  <single-button-modal
      v-if="singleModalPopupStatue"
      @close-modal="singleModalPopupStatue = false"
      :modal-message="singleButtonModalMessage"
      :router-path="singleButtonModalRoute"
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
  margin-bottom: 17px;
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

.apply-button {
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