<script>
import {onMounted, ref} from "vue";
import {SEARCH_FILTER_TYPES} from "@/constants/searchFilterTypes";
import SearchFilterModal from "@/components/SearchFilterModal.vue";
import {useRouter} from "vue-router";
import {ROUTES} from "@/router/routes";

export default {
  name: "CorporateJobPostingManagement",
  computed: {
    SEARCH_FILTER_TYPES() {
      return SEARCH_FILTER_TYPES
    }
  },
  components: { SearchFilterModal },
  setup() {
    const router = useRouter();

    const modalPopupStatue = ref(false);
    const searchInput = ref();
    const filterTypes = ref("");
    const selectedProvince = ref("전체 지역");
    const selectedJob = ref("전체 직무");
    const jobPostingList = ref();
    const jobPostingCount = ref(0);

    const searchCorporate = () => {
      // todo API 구현 시 아래에 로직 구현 하기
      console.log("검색어:", searchInput.value);
    }

    const onFilterClick = (filterType) => {
      filterTypes.value = filterType;
      modalPopupStatue.value = true;
    }

    const handleSelectFilter = (selected) => {
      if (selected.filterType === SEARCH_FILTER_TYPES.JOB) {
        selectedJob.value = selected.filterValue;
      }

      if (selected.filterType === SEARCH_FILTER_TYPES.REGIONS) {
        selectedProvince.value = selected.filterValue;
      }
    }

    const fetchCorporateUsers = () => {
      const data = [
        {
          entId: "USER001",
          entName: "기업1",
          createdAt: "2024-01-01",
          entField: "엔지니어",
          endAddr: "서울특별시"
        },
        {
          entId: "USER002",
          entName: "기업2",
          createdAt: "2024-02-01",
          entField: "엔지니어",
          endAddr: "서울특별시"
        },
      ];

      jobPostingList.value = data;
      jobPostingCount.value = jobPostingList.value.length;
    }

    onMounted(() => {
      fetchCorporateUsers();
    })

    const onMoveDetailPageClick = (postId) => {
      console.log("postId:", postId);
      router.push({
        name: ROUTES.JOB_POSTING_DETAIL.name,
        params:{
          id: postId
        },
        query: {
          delete: true
        }
      })
    }

    return {
      modalPopupStatue,
      searchInput,
      filterTypes,
      selectedProvince,
      selectedJob,
      jobPostingList,
      jobPostingCount,
      searchCorporate,
      onFilterClick,
      handleSelectFilter,
      onMoveDetailPageClick,
    };
  }
}
</script>

<template>
  <main class="body">
    <div class="header">기업회원 관리</div>
    <div class="subtitle">공고 관리</div>
    <div class="search-wrap">
      <input
          class="search-input"
          placeholder="기업명을 입력하세요"
          type="text"
          v-model="searchInput"
          @keyup.enter="searchCorporate"
      >
      <div class="filter-section">
        <div class="filter-item"
             @click="onFilterClick(SEARCH_FILTER_TYPES.JOB)"
             :style="{ color: selectedJob === '전체 직무' ? 'black' : '#024CAA' }">
          {{ selectedJob }}
        </div>
        <div class="filter-item"
             @click="onFilterClick(SEARCH_FILTER_TYPES.REGIONS)"
             :style="{ color: selectedProvince === '전체 지역' ? 'black' : '#024CAA' }">
          {{ selectedProvince }}
        </div>
      </div>
      <div class="job-posting-wrap">
        <div class="job-posting-info">{{ jobPostingCount }}건</div>
        <div class="job-posting-list" v-for="jobPosting in jobPostingList" :key="jobPosting">
          <div class="job-posting-list-top">
            <div class="course-title">{{ jobPosting.entName }}</div>
          </div>
          <div class="course-subtitle">{{ jobPosting.entField }}</div>
          <div class="course-schedule">
            <div class="schedule-info">{{ jobPosting.endAddr }}</div>
            <img src="@/assets/images/icons/rightarrows.png" class="right-arrow-icon" alt="Right Arrow Icon" @click="onMoveDetailPageClick(jobPosting.entId)">
          </div>
        </div>
      </div>
    </div>
  </main>
  <search-filter-modal
      v-if="modalPopupStatue"
      @close-modal="modalPopupStatue = false"
      @select-filter="handleSelectFilter"
      :filter-type="filterTypes"
  />
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

.filter-section {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.filter-item {
  flex: 1;
  text-align: center;
  font-size: 16px;
  padding: 10px;
  border: 1px solid #413F42;
  border-radius: 8px;
  background-color: #ffffff;
  height: 16px;
  margin-right: 10px;
}

.filter-item:last-child {
  margin-right: 0;
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

.course-subtitle {
  margin-bottom: 5px;
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