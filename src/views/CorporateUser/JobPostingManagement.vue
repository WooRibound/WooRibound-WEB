<script>
import {useRouter} from "vue-router";
import {ROUTES} from "@/router/routes";
import {formatDate3} from "@/utils/formatters";
import {onMounted, ref} from "vue";
import {fetchMyPostingList} from "@/api/services/corporateUserService";

export default {
  name: "JobPostingManagement",
  methods: {formatDate: formatDate3},
  setup() {
    const router = useRouter();

    const jobpostingCount = ref(0);
    const jobPostingList = ref();
    const applicantCount = ref(0);

    const onRegisterJobPostingClick = () => {
      router.push(ROUTES.JOB_POSTING_REGISTER.path);
    };

    const fetchJobPosting = async () => {
      try {
        const response = await fetchMyPostingList();
        jobPostingList.value = response.data || [];
        jobpostingCount.value = jobPostingList.value.length;
      } catch (error) {
        console.error("[fetchJobPosting] Error:", error);
        jobPostingList.value = [];
      }
    };

    onMounted(() => {
      fetchJobPosting();
    });

    const recruitmentPhase = (postState) => {
      switch (postState) {
        case "PENDING":
          return "오픈 전";
        case "ACTIVE":
          return "채용 중";
        case "CLOSED":
          return "채용 마감";
        default:
          return "";
      }
    };

    const recruitmentPhaseClass = (postState) => {
      switch (postState) {
        case "PENDING":
          return "phase-open";
        case "ACTIVE":
          return "phase-in-progress";
        case "CLOSED":
          return "phase-closed";
        default:
          return "";
      }
    };

    const onMoveDetailPageClick = (postId) => {
      router.push({
        name: ROUTES.CORPORATE_USER_JOB_POSTING_DETAIL.name,
        params:{
          id: postId
        },
      })
    }

    const onMoveApplicantDetailPageClick = (postId) => {
      router.push({
        name: ROUTES.APPLICANT_DETAIL_PAGE.name,
        params: {
          id: postId,
        },
      });
    };

    return {
      jobpostingCount,
      jobPostingList,
      applicantCount,
      onRegisterJobPostingClick,
      recruitmentPhase,
      recruitmentPhaseClass,
      onMoveDetailPageClick,
      onMoveApplicantDetailPageClick,
    };
  },
};
</script>


<template>
  <main class="body">
    <div class="header">
      <div class="header-title">공고 관리</div>
      <div class="header-register-job" @click="onRegisterJobPostingClick">공고 등록</div>
    </div>
    <div class="job-posting-wrap" v-if="jobpostingCount > 0">
      <div class="job-posting-info">{{ jobpostingCount }}건</div>
      <div class="job-posting-list" v-for="jobPosting in jobPostingList" :key="jobPosting">
        <div class="job-posting-list-top">
          <div class="course-title">{{ jobPosting.postTitle }}</div>
          <div :class="['recruitment-phase', recruitmentPhaseClass(jobPosting.postState)]">
            {{ recruitmentPhase(jobPosting.postState) }}
          </div>
        </div>
        <div class="job-posting-list-middle">
          <div class="course-subtitle">[모집직무] {{ jobPosting.jobName }}</div>
          <div class="applicants-info" @click="onMoveApplicantDetailPageClick(jobPosting.postId)">{{
              jobPosting.applicantCount
            }}명
          </div>
        </div>
        <div class="course-schedule">
          <div class="schedule-info">{{ formatDate(new Date(jobPosting.startDate)) }} ~
            {{ formatDate(new Date(jobPosting.endDate)) }}
          </div>
          <img src="@/assets/images/icons/rightarrows.png" class="right-arrow-icon" alt="Right Arrow Icon"
               @click="onMoveDetailPageClick(jobPosting.postId)">
        </div>
      </div>
    </div>
    <div class="job-posting-wrap" v-else>
      등록된 공고가 없습니다.
    </div>
  </main>
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

.header-register-job {
  background-color: #024CAA; /* 버튼 배경색 */
  color: white; /* 버튼 텍스트 색 */
  padding: 10px 15px; /* 여백 */
  border-radius: 5px; /* 모서리 둥글게 */
  cursor: pointer; /* 포인터 커서 */
  transition: background-color 0.3s; /* 호버 효과를 위한 전환 */
  font-size: 10pt;
}

.header-register-job:hover {
  background-color: #0056b3; /* 호버 시 배경색 변경 */
}

.job-posting-wrap {
  margin-top: 10px;
}

.job-posting-info {
  font-size: 20px;
  font-weight: bold;
  margin-top: 15px;
  margin-left: 10px;
  margin-bottom: 10px;
}

.job-posting-list {
  background-color: #ffffff;
  border-radius: 15px;
  padding: 15px;
  color: #000000;
  font-weight: bold;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.job-posting-list-top {
  display: flex;
  justify-content: space-between; /* Aligns items on both ends */
  align-items: center;
  margin-bottom: 5px;
}

.course-title {
  margin-bottom: 5px;
  font-size: 13pt;
}

.recruitment-phase {
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 14px;
  color: #ffffff;
  font-weight: bold;
  text-align: center;
  width: 70px;
}

/* 상태에 따른 배경색 */
.phase-open {
  background-color: #5B99C2;
}

.phase-in-progress {
  background-color: #FF9800;
}

.phase-closed {
  background-color: #686D76;
}

.job-posting-list-middle {
  display: flex;                  /* Flexbox를 사용 */
  justify-content: space-between; /* 두 요소를 양 끝에 배치 */
  align-items: center;            /* 세로 정렬을 가운데로 */
}

.course-subtitle {
  flex: 1;
  margin-bottom: 12px;
  color: #6c757d;
}

.applicants-info {
  font-size: 20px;           /* 글자 크기 */
  color: #666;               /* 텍스트 색상 */
  margin-top: 8px;          /* 위쪽 여백 */
  margin-bottom: 8px;          /* 위쪽 여백 */
  margin-right: 20px;          /* 위쪽 여백 */
  cursor: pointer;
  text-decoration: underline;
}

.course-schedule {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  color: #52585d;
  font-size: 12pt;
}

.schedule-info {
  flex: 1;
}

.right-arrow-icon {
  width: 20px;
  height: auto;
  cursor: pointer;
}
</style>