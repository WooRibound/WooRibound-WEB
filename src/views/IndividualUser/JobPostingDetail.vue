<script>
import { ref, computed, onMounted } from "vue";
import { formatDate1 } from "@/utils/format";
import { ROUTES } from "@/router/routes";
import { useRoute, useRouter } from "vue-router";
import TwoButtonModal from '@/components/TwoButtonModal.vue';
import handleApiCall from '@/api/apiService';

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
    const router = useRouter();
    const postId = route.params.id;
    const isDelete = route.query.delete;

    const modalPopupStatue = ref(false);
    const modalMessage = ref('');

    const formattedStartDate = computed(() => formatDate1(jobposting.value.startDate));
    const formattedEndDate = computed(() => formatDate1(jobposting.value.endDate));

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

    const fetchJobPosting = async () => {
      try {
        const response = await handleApiCall('get', '/individualuser/jobposting/detail', null, {
          params: {
            postId: postId
          }
        });
        jobposting.value = {
          entName: response.data.entName,
          postTitle: response.data.postTitle,
          postImg: response.data.postImg,
          startDate: response.data.startDate,
          endDate: response.data.endDate,
          jobName: response.data.jobName,
          entAddr1: response.data.entAddr1,
          entAddr2: response.data.entAddr2,
        };
      } catch (error) {
        console.error("채용공고 상세 내용을 불러오지 못했습니다. 다시 시도해 주세요.", error);
      }
    };

    onMounted(() => {
      fetchJobPosting();
    });

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

    return {
      showDeleteModal,
      modalMessage,
      modalPopupStatue,
      formattedStartDate,
      formattedEndDate,
      isDelete,
      postId,
      jobposting,
      onApplyClick,
      onDeletedClick,
      confirmDelete,
      closeModal
    };
  }
};
</script>

<template>
  <main class="job-posting-detail">
    <div class="job-posting-header">채용공고 상세페이지</div>
    <div class="job-posting-content">
      <div class="company-logo">
        <img :src="jobposting.postImg" alt="Company Logo">
      </div>
      <div class="job-posting-info">
        <div class="company-name">{{ jobposting.entName }}</div>
        <div class="job-title">{{ jobposting.postTitle }}</div>
        <div class="application-period">공고 게시 및 서류 접수</div>
        <div class="application-dates">{{ formattedStartDate }} ~ {{ formattedEndDate }}</div>
        <div class="company-address-label">기업 주소</div>
        <div class="company-address">{{ jobposting.entAddr1 }} {{ jobposting.entAddr2 }}</div>
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
