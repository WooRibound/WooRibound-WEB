<script>
import {ref, computed, onMounted} from "vue";
import { formatDate1 } from "@/utils/format";
import {useRoute} from "vue-router";
import {fetchMyPostingDetail} from "@/api/services/corporateUserService";

export default {
  name: "JobPostingDetail",
  setup() {
    const route = useRoute();
    const postId = route.params.id
    const isDelete = route.query.delete
    console.log(postId);

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

    // 시작일과 종료일 포맷팅
    const formattedStartDate = computed(() =>
        startDate.value ? formatDate1(new Date(startDate.value)) : "-"
    );
    const formattedEndDate = computed(() =>
        endDate.value ? formatDate1(new Date(endDate.value)) : "-"
    );

    const onDeletedClick = (postId) => {
      console.log("postId:", postId);
    }

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
      isDelete,
      postId,
      entName,
      postTitle,
      postImg,
      jobName,
      formattedStartDate,
      formattedEndDate,
      entAddr1,
      entAddr2,
      onDeletedClick,
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
    <div class="delete-button" v-if="isDelete" @click="onDeletedClick(postId)">삭제하기</div>
  </main>
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
  border-radius: 10px 10px 0 0; /* 꼭지점 둥글게 */
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f1f1f1;    /* 배경색으로 지정 */
}

.company-logo img {
  max-height: 100%;            /* 높이에 맞춰 이미지 크기 조절 */
  max-width: 100%;             /* 너비에 맞춰 이미지 크기 조절 */
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
  font-size: 15px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.application-period {
  font-size: 16px;
  margin-bottom: 5px;
  font-weight: bold;
}

.application-dates {
  font-size: 16px;
  color: #333; /* 기존 색상과 통일 */
  margin-bottom: 10px; /* 아래쪽 여백 */
}

.company-address-label {
  font-size: 16px;
  margin-top: 10px; /* 위쪽 여백 추가 */
  font-weight: bold;
}

.company-address {
  font-size: 16px;
  color: #333;
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
