<script>
import {formatDate} from "@/utils/format";
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {ROUTES} from "@/router/routes";

export default {
  name: "JobApplicationStatus",
  methods: { formatDate },
  setup() {
    const router = useRouter();

    const jopApplicationCount = ref(0);
    const jobApplicationList = ref();

    const fetchJopApplication = () => {
      // todo 채용지원 리스트 API 구현 시 아래에 로직 구현 하기
      // viewType이 career, new, all에 따라 데이터 불러오기

      const data = [
        {
          postId: 1,
          entId: 1,
          postTitle: '2024년 하반기 시니어 개발자 모집',
          entName: '우리 바운드 (주)',
          jobName: '서비스',
          postImg: require('@/assets/images/logo/company_sample.png'), // 이미지 경로를 require로 수정
          startDate: '2024-11-01',
          endDate: '2024-11-15',
          postState: 'PASSED',
        },
        {
          postId: 1,
          entId: 1,
          postTitle: '2024년 하반기 시니어 개발자 모집',
          entName: '우리 바운드 (주)',
          jobName: '서비스',
          postImg: require('@/assets/images/logo/company_sample.png'), // 이미지 경로를 require로 수정
          startDate: '2024-11-01',
          endDate: '2024-11-15',
          postState: 'PENDING',
        },
      ];

      jobApplicationList.value = data;
      jopApplicationCount.value = jobApplicationList.value.length;
    }

    onMounted(() => {
      fetchJopApplication();
    })

    const onMoveDetailPageClick = (postId) => {
      console.log("postId:", postId);
      router.push({
        name: ROUTES.JOB_POSTING_DETAIL.name,
        params:{
          id: postId
        },
      })
    }

    const recruitmentPhase = (postState) => {
      switch (postState) {
        case 'PASSED':
          return '합격';
        case 'PENDING':
          return '결과 대기중';
        case 'FAILED':
          return '불합격';
        default:
          return '';
      }
    }

    const recruitmentPhaseClass = (postState) => {
      switch (postState) {
        case 'PASSED':
          return 'phase-passed'; // 합격
        case 'PENDING':
          return 'phase-pending'; // 결과 대기중
        case 'FAILED':
          return 'phase-failed'; // 불합격
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
          <div :class="['recruitment-phase', recruitmentPhaseClass(jobApplication.postState)]">{{ recruitmentPhase(jobApplication.postState) }}</div>
        </div>
        <div class="course-subtitle">{{ jobApplication.postTitle }}</div>
        <div class="course-schedule">
          <div class="schedule-info">{{ formatDate(new Date(jobApplication.startDate)) }} ~ {{ formatDate(new Date(jobApplication.endDate)) }}</div>
          <img src="@/assets/images/icons/rightarrows.png" class="right-arrow-icon" alt="Right Arrow Icon" @click="onMoveDetailPageClick(jobApplication.postId)">
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
  margin-left: 10px;
  margin-bottom: 10px;
}

.job-posting-list {
  background-color: #D9D9D9;
  border-radius: 15px;
  padding: 15px;
  color: #000000;
  font-weight: bold;
  margin-bottom: 5px;
}

.job-posting-list-top {
  display: flex;
  justify-content: space-between; /* Aligns items on both ends */
  align-items: center;
  margin-bottom: 5px;
}

.course-title {
  font-size: 18px;
  margin-right: auto; /* Ensures it stays on the left */
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


.course-schedule {
  display: flex;
  justify-content: space-between;
  align-items: center;
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