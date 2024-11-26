<script>
import {formatDate1} from "@/utils/formatters";
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {ROUTES} from "@/router/routes";
import {fetchJobApply} from "@/api/services/individualUserService";
import {APPLY_TYPES} from "@/constants/applyTypes";

export default {
  name: "JobApplicationStatus",
  methods: { formatDate1 },
  setup() {
    const router = useRouter();

    const jopApplicationCount = ref(0);
    const jobApplicationList = ref();

    const fetchJopApplication = async () => {
      const response = await fetchJobApply();

      jobApplicationList.value = response.map((item) => ({
        applyId: item.applyId,
        result: item.result,
        entName: item.entName,
        postTitle: item.postTitle,
        startDate: formatDate1(item.startDate),
        endDate: formatDate1(item.endDate),
        entAddr1: item.entAddr1,
        entAddr2: item.entAddr2
      }));

      jopApplicationCount.value = jobApplicationList.value.length;
    }

    onMounted(() => {
      fetchJopApplication();
    })

    const onMoveDetailPageClick = (applyId) => {
      const jobApplication = jobApplicationList.value.find(item => item.applyId === applyId);
      const resultValue = jobApplication && jobApplication.result === APPLY_TYPES.CANCELED ? 'canceled' : null;

      router.push({
        name: ROUTES.JOB_POSTING_DETAIL.name,
        params:{
          applyId: applyId,
          state: resultValue,
        },
      })
    }

    const recruitmentPhase = (postState) => {
      switch (postState) {
        case APPLY_TYPES.ACCEPTED:
          return '합격';
        case APPLY_TYPES.PENDING:
          return '결과 대기중';
        case APPLY_TYPES.REJECTED:
          return '불합격';
        case APPLY_TYPES.CANCELED:
          return '지원 취소';
        default:
          return '';
      }
    }

    const recruitmentPhaseClass = (postState) => {
      switch (postState) {
        case APPLY_TYPES.ACCEPTED:
          return 'phase-passed'; // 합격
        case APPLY_TYPES.PENDING:
          return 'phase-pending'; // 결과 대기중
        case APPLY_TYPES.FAILED:
          return 'phase-failed'; // 불합격
        case APPLY_TYPES.CANCELED:
          return 'phase-canceled';
        default:
          return '';
      }
    }

    return {
      jobApplicationList,
      jopApplicationCount,
      onMoveDetailPageClick,
      recruitmentPhase,
      recruitmentPhaseClass,
    };
  }
}
</script>

<template>
  <main class="body">
    <div class="header">지원 현황</div>
    <div class="job-posting-wrap">
      <div class="job-posting-info">{{ jopApplicationCount }}건</div>
      <div class="job-posting-list" v-for="jobApplication in jobApplicationList" :key="jobApplication">
        <div class="job-posting-list-top">
          <div class="course-title">{{ jobApplication.entName }}</div>
          <div :class="['recruitment-phase', recruitmentPhaseClass(jobApplication.result)]">{{ recruitmentPhase(jobApplication.result) }}</div>
        </div>
        <div class="course-subtitle">{{ jobApplication.postTitle }}</div>
        <div class="course-schedule">
          <div class="schedule-info">{{ jobApplication.startDate }} ~ {{ jobApplication.endDate }}</div>
          <img src="@/assets/images/icons/rightarrows.png" class="right-arrow-icon" alt="Right Arrow Icon" @click="onMoveDetailPageClick(jobApplication.applyId)">
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.body {
  flex: 1;                      /* 가변 영역, 헤더와 바텀 내비게이션을 제외한 나머지 공간 차지 */
  padding: 20px;                /* 내부 여백 */
  box-sizing: border-box;       /* 패딩을 포함한 크기 계산 */
  background-color: #f8f9fa;    /* 배경색 */
  overflow-y: auto;             /* 내용이 넘칠 경우 스크롤 가능 */
}

.header {
  font-size: 24px;              /* 헤더 폰트 크기 */
  font-weight: bold;            /* 헤더 두껍게 */
  margin-bottom: 20px;          /* 아래쪽 여백 */
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
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.course-title {
  margin-bottom: 12px;
  color: #6c757d;
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

.phase-passed {
  background-color: #FF9800; /* 합격 */

}

.phase-pending {
  background-color: #5B99C2; /* 결과 대기중 */
}

.phase-failed {
  background-color: #686D76; /* 불합격 */
}
.phase-canceled {
  background-color: #DE7C7D; /* 지원 취소 */
}


.course-schedule {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.schedule-info {
  flex: 1;
  color: #6c757d;
  font-size: 10pt;
}


.right-arrow-icon {
  width: 20px;
  height: auto;
  cursor: pointer;
}
</style>