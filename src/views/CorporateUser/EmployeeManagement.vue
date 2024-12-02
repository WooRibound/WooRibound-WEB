<script>
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {RECOMMEND_TYPES} from "@/constants/recommendTypes";
import {ROUTES} from "@/router/routes";
import {fetchEmployeeList, setEmployeeRating} from "@/api/services/corporateUserService";
import {formatDate2} from "../../utils/formatters";

export default {
  name: "EmployeeManagement",
  methods: {formatDate2},
  computed: {
    RECOMMEND_TYPES() {
      return RECOMMEND_TYPES
    }
  },
  setup() {
    const router = useRouter();

    const employmentList = ref([]);
    // const empRecomm = ref([]);
    // 추천여부 설정
    const onRecommendClick = async (index, status) => {


      const payload = {
        empId: employmentList.value[index].empId,
        empRecomm: status === "recommend" ? "Y" : "N",
      }

      try {
        const response = await setEmployeeRating(payload);
        if (response.status === 200) {
          employmentList.value[index].empRecomm = status === "recommend" ? "Y" : "N";
          employmentList.value[index].isActionDisabled = true; // 상태 업데이트 후 버튼 비활성화
        } else {
          console.error("추천 상태 업데이트 실패:", response.message);
        }
      } catch (error) {
        console.error("[onRecommendClick] Error:", error);
      }
    };

    const fetchEmployment = async () => {
      try {
        const response = await fetchEmployeeList();
        const currentDate = new Date(); // 오늘 날짜

        employmentList.value = response.data.map((employee, index) => {
          const hireDate = new Date(employee.hireDate);
          const oneMonthPassed = (currentDate - hireDate) / (1000 * 60 * 60 * 24) >= 30;

          return {
            ...employee,
            index,
            isOneMonthBefore: !oneMonthPassed, // 1개월 이전인지 확인
            isActionDisabled: !oneMonthPassed || employee.empRecomm !== null, // 1개월 미만 또는 empRecomm이 설정되었으면 비활성화
          };
        });

      } catch (error) {
        console.error("[fetchEmployment] Error:", error);
      }
    };



    onMounted(() => {
      fetchEmployment();
    })

    const onMoveResumePageClick = (userId) => {
      router.push({
        name: ROUTES.READONLY_RESUME_PAGE.name,
        params: {
          id: userId
        }
      })
    }

    return {
      employmentList,
      onRecommendClick,
      onMoveResumePageClick,
    };
  }
}
</script>

<template>
  <main class="body">
    <div class="header">직원 관리</div>
    <div class="subtitle">직원 목록 조회 / 평가하기</div>
    <div class="applicant-info">
      <table class="applicant-table">
        <thead>
        <tr>
          <th>고용일자</th>
          <th>이름</th>
          <th>직무</th>
          <th>평가하기</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="employment in employmentList" :key="employment.empId">
          <td>
            {{ formatDate2(new Date(employment.hireDate)) }}
          </td>
          <td class="name" @click="onMoveResumePageClick(employment.empId)">
            {{ employment.userName }}
          </td>
          <td>{{ employment.jobName }}</td>
          <td>
            <!-- 평가전 -->
            <div v-if="employment.isOneMonthBefore" class="status-accepted-gray"> 평가전 </div>
            <!-- 평가종료 -->
            <div v-else-if="employment.empRecomm === 'Y'" class="status-accepted-gray">
              평가종료 </div>
            <!-- 추천 버튼 -->
            <div v-else-if="employment.isActionDisabled" class="status-accepted" @click="onRecommendClick(employment.index, 'recommend')">
              추천 </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<style scoped>
.body {
  flex: 1; /* 가변 영역, 헤더와 바텀 내비게이션을 제외한 나머지 공간 차지 */
  padding: 20px; /* 내부 여백 */
  box-sizing: border-box; /* 패딩을 포함한 크기 계산 */
  background-color: #f8f9fa; /* 배경색 */
  overflow-y: auto; /* 내용이 넘칠 경우 스크롤 가능 */
}

.header {
  font-size: 24px; /* 헤더 폰트 크기 */
  font-weight: bold; /* 헤더 두껍게 */
  margin-bottom: 20px; /* 아래쪽 여백 */
}

.subtitle { /* 소제목 스타일 */
  font-size: 18px; /* 글자 크기 */
  font-weight: bold; /* 글자 두께 */
  margin-bottom: 10px; /* 아래쪽 여백 */
  color: #333; /* 텍스트 색상 */
}

.job-application-info > div {
  margin: 5px 0; /* 위아래 간격 설정 */
}

.applicant-table {
  width: 100%; /* 테이블이 부모 컨테이너 안에서 정렬되도록 설정 */
  max-width: 1200px; /* 최대 너비 제한 */
  border-collapse: collapse; /* 테이블 경계선 겹침 방지 */
  margin-top: 20px;
  table-layout: auto; /* 열 너비를 자동으로 조정 */
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
  white-space: nowrap; /* 🔴 줄바꿈 방지 */
}

.applicant-table th:nth-child(4),
.applicant-table td:nth-child(4) {
  width: 15%; /* 🔴 평가하기 컬럼의 너비를 20%로 설정 */
}

.resume-link:hover {
  text-decoration: underline; /* 호버 시 밑줄 */
}

.status-container {
  display: flex; /* Flexbox 사용 */
  gap: 5px; /* 요소 간의 간격 */
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

.status-accepted-gray {
  display: inline-block;
  padding: 6px 12px;
  background-color: #bbbbbb;
  color: white;
  border-radius: 5px;
  font-size: 8pt;
  text-align: center;
  white-space: nowrap;
}

.text-gray {
  color: gray;
}

.name {
  text-decoration: underline;
}

.disabled {
  opacity: 0.5;
  pointer-events: none; /* 클릭 불가능 */
}

</style>