<script>
import {onMounted, ref} from "vue";

export default {
  name: "CorporateUserWithdrawal",
  setup() {
    const searchInput = ref("");

    const corporateUserList = ref();

    const searchCorporate = () => {
      // todo API 구현 시 아래에 로직 구현 하기
      console.log("검색어:", searchInput.value);
    }

    const fetchCorporateUser = () => {
      const data = [
        {
          entId: "USER001",
          entName: "기업1",
          createdAt: "2024-01-01",
          entField: "엔지니어",
          isDeleted: ""
        },
        {
          entId: "USER002",
          entName: "기업2",
          createdAt: "2024-02-01",
          entField: "isDeleted",
          isDeleted: "엔지니어"
        },
        {
          entId: "USER003",
          entName: "기업3",
          createdAt: "2024-01-01",
          entField: "엔지니어",
          isDeleted: "isDeleted",
        },
      ];

      corporateUserList.value = data;
    }

    onMounted(() => {
      fetchCorporateUser();
    })

    const onApprovalClick = (filed) => {
      console.log(filed);
    }
    return {
      searchInput,
      corporateUserList,
      searchCorporate,
      onApprovalClick,
    };
  }
}
</script>

<template>
  <main class="body">
    <div class="header">기업회원 관리</div>
    <div class="subtitle">기업 탈퇴</div>
    <div class="search-wrap">
      <input
          class="search-input"
          placeholder="기업명을 입력하세요"
          type="text"
          v-model="searchInput"
          @keyup.enter="searchCorporate"
      >
    </div>
    <div class="applicant-info">
      <table class="applicant-table">
        <thead>
        <tr>
          <th>가입일자</th>
          <th>기업명</th>
          <th>산업</th>
          <th>가입</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="corporateUser in corporateUserList" :key="corporateUser">
          <td>{{ corporateUser.createdAt }}</td>
          <td>{{ corporateUser.entName }}</td>
          <td >{{ corporateUser.entField }}</td>
          <td>
            <div class="status-container">
              <div class="status-accepted" @click="onApprovalClick('approval')">승인</div>
              <div class="status-rejected" @click="onApprovalClick('rejection')">반려</div>
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

.search-input {
  font-size: 16px;
  width: 100%;
  padding: 10px 30px 10px 10px;
  border-radius: 8px;
  border: 1px solid #413F42;
  box-sizing: border-box;
  background-image: url('@/assets/images/icons/search.png');
  background-size: 20px 20px;
  background-repeat: no-repeat;
  background-position: right 10px center;
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
  font-size: 9pt;
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
