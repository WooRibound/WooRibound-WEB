<script>
import {useRoute, useRouter} from "vue-router";
import {ROUTES} from "@/router/routes";

export default {
  name: "ApplicantDetailPage",
  setup() {
    const route = useRoute();
    const router = useRouter();

    const id = route.params.id
    console.log(id);

    const onMoveResumePageClick = (userId) => {
      router.push({
        name: ROUTES.READONLY_RESUME_PAGE.name,
        params: {
          id: userId
        }
      })
    }

    const onApplicantStateClick = (status) => {
      // todo 지원자 합,불 API 구현시 아래 로직 구현하기
      if (status === "accepted") {
        console.log("합격");
      } else {
        console.log("불합격");
      }
    }
    return {
      onMoveResumePageClick,
      onApplicantStateClick
    };
  }
}
</script>

<template>
  <main class="body">
    <div class="header">공고 관리</div>
    <div class="subtitle">지원자</div>
    <div class="applicant-info">
      <div class="job-application-info">
        <div class="company-name">우리바운드 (주)</div>
        <div class="job-title">2024년 하반기 시니어 개발자 모집</div>
        <div class="job-duration">10월1일(월) ~ 11월10일(일)</div>
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
        <tr>
          <td>이승준</td>
          <td>남/30</td>
          <td><div class="resume-link" @click="onMoveResumePageClick">보기</div></td>
          <td>
            <div class="status-container">
              <div class="status-accepted" @click="onApplicantStateClick('accepted')">합격</div>
              <div class="status-rejected" @click="onApplicantStateClick('rejected')">불합격</div>
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
}
</style>
