<script>
import { ref,computed } from "vue";
import { formatDate1 } from "@/utils/format";
import {useRoute} from "vue-router";

export default {
  name: "JobPostingDetail",
  setup() {
    const route = useRoute();
    const postId = route.params.id
    const isDelete = route.query.delete
    // todo postId값으로 채용공고 상세 API 구현 후 아래에 로직 구현
    console.log(postId);

    const entName = ref("우리바운드 (주)");
    const postTitle = ref("2024 하반기 시니어 개발자 모집");
    const postImg = require("@/assets/images/logo/company_sample.png");
    const startDate = ref(new Date('2024-11-01'));  // 채용 시작일
    const endDate = ref(new Date('2024-11-15'));    // 채용 마감일
    const entAddr = ref("서울특별시 강서구 사암대로 179 상암타워");

    const formattedStartDate = computed(() => formatDate1(startDate.value));
    const formattedEndDate = computed(() => formatDate1(endDate.value));

    const onDeletedClick = (postId) => {
      // todo API 구현 시 아래에 로직 구현 하기
      console.log("postId:", postId);
    }

    return {
      isDelete,
      postId,
      entName,
      postTitle,
      postImg,
      formattedStartDate,
      formattedEndDate,
      entAddr,
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
        <div class="application-period">공고 게시 및 서류 접수</div>
        <div class="application-dates">{{ formattedStartDate }} ~ {{ formattedEndDate }}</div>
        <div class="company-address-label">기업 주소</div>
        <div class="company-address">{{ entAddr }}</div>
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
  font-size: 18px;
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
