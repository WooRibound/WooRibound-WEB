<script>
import {useRoute, useRouter} from "vue-router";
import {ROUTES} from "@/router/routes";
import { formatDate1 } from "@/utils/formatters"
import {fetchApplicantList, fetchMyPostingDetail, setApplicantResult} from "@/api/services/corporateUserService";
import {computed, onMounted, ref} from "vue";

export default {
  name: "ApplicantDetailPage",
  setup() {
    const route = useRoute();
    const router = useRouter();``

    const postId = route.params.id;
    const applicantsList = ref([]);
    const jobposting = ref({});
    const startDate = ref("");
    const endDate = ref("");
    const userId = ref([]);
    const applyStatus = ref([]);
    const index = ref([]);
    const applyId = ref([]);
    const jobId = ref();

    // 시작일과 종료일 포맷팅
    const formattedStartDate = computed(() =>
        startDate.value ? formatDate1(new Date(startDate.value)) : "-"
    );
    const formattedEndDate = computed(() =>
        endDate.value ? formatDate1(new Date(endDate.value)) : "-"
    );

    const fetchJobPostingInfo = async (postId) => {
      try {
        console.debug("Fetching job application info");
        const response = await fetchMyPostingDetail(postId);
        console.debug("API Response (Job Info):", response);
        jobposting.value = response.data || {};
        startDate.value = jobposting.value.startDate;
        endDate.value = jobposting.value.endDate;
        jobId.value = jobposting.value.jobId;
      } catch (error) {
        console.error("[fetchJobPostingInfo] Error:", error);
        jobposting.value = {};
      }
    };

    const fetchApplicantsList = async (postId) => {
      try {
        console.info("Fetching applicant lists");
        const response = await fetchApplicantList(postId);
        console.info("API Response:", response);

        applicantsList.value = response.data.map((applicant, index) => ({
          ...applicant,
          index,
        }));
        applyStatus.value = applicantsList.value.map((applicant) => applicant.result);
        userId.value = applicantsList.value.map((applicant) => applicant.userId);
        applyId.value = applicantsList.value.map((applicant) => applicant.applyId);
        index.value = applicantsList.value.map((applicant) => applicant.index);

      } catch (error) {
        console.error("[fetchApplicantsList] Error:", error);
        applicantsList.value = [];
      }
    };

    const onMoveResumePageClick = (userId) => {
      console.info("userId: "+ userId);
      router.push({
        name: ROUTES.READONLY_RESUME_PAGE.name,
        params: {
          id: userId
        }
      })
    }

    onMounted(() => {
      fetchJobPostingInfo(postId);
      fetchApplicantsList(postId);
    });


    const onApplicantStateClick = async (index, applyId, applyResult) => {
      console.info("index, applyId, applyResult:", index, applyId, applyResult, );

      const payload = {
        applyId,
        applyResult
      };

      try {
        const response = await setApplicantResult(payload);
        if (response.status === 200) {
          // 상태 업데이트
          applicantsList.value[index].result = applyResult === "ACCEPTED" ? "ACCEPTED" : "FAILED";
          console.log(`지원자 상태 업데이트 완료: ${applyResult}`);
        } else {
          console.error("지원자 상태 업데이트 실패:", response.message);
        }
      } catch (error) {
        console.error("[onApplicantStateClick] Error:", error);
      }
    };

    const onRecommendButtonClick = (postId, jobId) => {
      console.log("추천지원자 API 호출 "+ postId +" " + jobId);
      router.push({
        name: ROUTES.APPLICANT_RECOMMEND_PAGE.name,
        params: {
          postId: postId,
          jobId: jobId
        }
      })
    };



    return {
      applyStatus,
      formattedStartDate,
      formattedEndDate,
      jobposting,
      applicantsList,
      onMoveResumePageClick,
      onApplicantStateClick,
      onRecommendButtonClick,
      postId
    };
  }
}
</script>

<template>
  <main class="body">
    <div class="header">공고 관리</div>
    <div class="applicant-info">
      <div class="subtitle">지원자 목록</div>
      <div class="job-application-info">
        <div class="job-title">{{ jobposting.postTitle }}</div>
        <div class="job-name">{{ jobposting.jobName }}</div>
      </div>
      <div class="table-controls">
        <div class="job-duration">{{ formattedStartDate }} ~ {{ formattedEndDate }}</div>
        <button class="recommend-button" @click="onRecommendButtonClick(postId, jobposting.jobId)">추천 지원자</button>
      </div>
      <table class="applicant-table">
        <thead>
        <tr>
          <th>이름</th>
          <th>성별/나이</th>
          <th>이력서</th>
          <th>합격 여부</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="applicant in applicantsList" :key="applicant.userId">
          <td>{{ applicant.applicantName }}</td>
          <td>{{ applicant.applicantGender }}/{{ applicant.applicantAge }}</td>
          <td><div class="resume-link" @click="onMoveResumePageClick(applicant.userId)">보기</div></td>
          <td>
            <div class="status-container">
              <div v-if="applicant.result === 'PENDING'">
                <div class="status-accepted" @click="onApplicantStateClick(applicant.index, applicant.applyId, 'ACCEPTED')">합격</div>
                <div class="status-rejected" @click="onApplicantStateClick(applicant.index, applicant.applyId, 'REJECTED')">불합격</div>
              </div>
              <div v-else-if="applicant.result === 'ACCEPTED'" class="status-accepted disabled">
                합격 처리 완료
              </div>
              <div v-else-if="applicant.result === 'REJECTED'" class="status-rejected disabled">
                불합격 처리 완료
              </div>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
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

.subtitle {                     /* 소제목 스타일 */
  font-size: 18px;              /* 글자 크기 */
  font-weight: bold;            /* 글자 두께 */
  margin-bottom: 10px;          /* 아래쪽 여백 */
  color: #333;                  /* 텍스트 색상 */
}

.job-application-info > div {
  margin: 5px 0;                /* 위아래 간격 설정 */
}

.applicant-table {
  width: 100%; /* 테이블을 가로로 꽉 차게 설정 */
  border-collapse: collapse; /* 테이블 경계선 겹침 방지 */
  margin-top: 20px; /* 위쪽 여백 */
}

.applicant-table th {
  border-top: 1px solid #333; /* 제목 행 상단 선 */
  border-bottom: 1px solid #333; /* 제목 행 하단 선 */
  padding: 10px; /* 내부 여백 */
  text-align: center; /* 중앙 정렬 */
  background-color: #f1f1f1; /* 배경색 */
  white-space: nowrap; /* 텍스트가 한 줄로 나오도록 설정 */
}

.applicant-table td {
  padding: 10px; /* 내부 여백 */
  text-align: center;
}

.resume-link {
  display: inline-block; /* 블록 레벨 요소로 변환 */
  padding: 6px 12px; /* 내부 여백 */
  background-color: #024CAA; /* 배경색 */
  color: white; /* 글자 색상 */
  border-radius: 5px; /* 둥근 모서리 */
  text-align: center; /* 텍스트 중앙 정렬 */
  white-space: nowrap; /* 텍스트가 한 줄로 나오도록 설정 */
  font-size: 8pt;
}

.resume-link:hover {
  text-decoration: underline; /* 호버 시 밑줄 */
}
.status-container {
  display: flex; /* Flexbox 사용 */
  gap: 5px;     /* 요소 간의 간격 */
  justify-content: center; /* 가운데 정렬 */
}

.status-accepted {
  display: inline-block; /* 블록 레벨 요소로 변환 */
  padding: 6px 12px; /* 내부 여백 */
  background-color: #5B99C2; /* 배경색 */
  color: white; /* 글자 색상 */
  border-radius: 5px; /* 둥근 모서리 */
  text-align: center; /* 텍스트 중앙 정렬 */
  white-space: nowrap; /* 텍스트가 한 줄로 나오도록 설정 */
  font-size: 8pt;
  cursor: pointer;
}

.status-rejected {
  display: inline-block; /* 블록 레벨 요소로 변환 */
  padding: 6px 12px; /* 내부 여백 */
  background-color: #7AB2D3; /* 배경색 */
  color: white; /* 글자 색상 */
  border-radius: 5px; /* 둥근 모서리 */
  text-align: center; /* 텍스트 중앙 정렬 */
  white-space: nowrap; /* 텍스트가 한 줄로 나오도록 설정 */
  font-size: 8pt;
  cursor: pointer;
}
.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.table-controls {
  display: flex; /* 🔴 한 줄로 배치 */
  justify-content: space-between; /* 🔴 좌우 정렬 */
  align-items: center; /* 🔴 수직 정렬 */
  margin-bottom: 15px; /* 테이블과의 간격 */
}

.job-duration {
  font-size: 14px; /* 🔴 날짜 폰트 크기 */
  color: #555; /* 🔴 날짜 색상 */
}

.recommend-button {
  display: inline-block;
  padding: 6px 12px;
  background-color: #024CAA;
  color: white;
  border: none;
  border-radius: 5px;
  text-align: center;
  font-size: 10pt;
  font-weight: bold;
  cursor: pointer;
}

.recommend-button:hover {
  background-color: #023a87;
}

.recommend-button:active {
  background-color: #022d66;
}


</style>
