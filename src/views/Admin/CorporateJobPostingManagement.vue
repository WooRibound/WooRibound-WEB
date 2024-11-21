<script>
import { onMounted, ref } from "vue";
import { SEARCH_FILTER_TYPES } from "@/constants/searchFilterTypes";
import SearchFilterModal from "@/components/SearchFilterModal.vue";
import { useRouter } from "vue-router";
import { ROUTES } from "@/router/routes";
import { fetchJobPostings } from "@/api/services/adminServiece";

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
    const selectedIndustry = ref("전체 산업");
    const jobPostingList = ref();
    const jobPostingCount = ref(0);

    const searchJobPosting = () => {
      loadJobPostings();
    }

    const onFilterClick = (filterType) => {
      filterTypes.value = filterType;
      modalPopupStatue.value = true;
    }

    const handleSelectFilter = (selected) => {
      if (selected.filterType === SEARCH_FILTER_TYPES.INDUSTRY) {
        selectedIndustry.value = selected.filterValue;
        loadJobPostings();
      }

      if (selected.filterType === SEARCH_FILTER_TYPES.REGIONS) {
        selectedProvince.value = selected.filterValue;
        loadJobPostings();
      }
    }

    const loadJobPostings = async () => {
      try {
        const jobPostings = await fetchJobPostings(
          searchInput.value,
          selectedIndustry.value,
          selectedProvince.value
        );
        jobPostingList.value = jobPostings;
        jobPostingCount.value = jobPostings.length;
      } catch (error) {
        console.error("fetchJobPostings API 호출 오류:", error);
      }
    };

    onMounted(() => {
      loadJobPostings();
    })

    const recruitmentPhase = (postState) => {
      switch (postState) {
        case 'PENDING':
          return '오픈 전';
        case 'ACTIVE':
          return '채용 중';
        case 'CLOSED':
          return '채용 마감';
        default:
          return '';
      }
    }

    const recruitmentPhaseClass = (postState) => {
      switch (postState) {
        case 'PENDING':
          return 'phase-open';
        case 'ACTIVE':
          return 'phase-in-progress';
        case 'CLOSED':
          return 'phase-closed';
        default:
          return '';
      }
    }

    const onMoveDetailPageClick = (postId) => {
      router.push({
        name: ROUTES.CORPORATE_USER_JOB_POSTING_DETAIL.name,
        params: {
          id: postId
        },
      })
    }

    return {
      modalPopupStatue,
      searchInput,
      filterTypes,
      selectedProvince,
      selectedIndustry,
      jobPostingList,
      jobPostingCount,
      searchJobPosting,
      recruitmentPhase,
      recruitmentPhaseClass,
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
      <input class="search-input" placeholder="기업명을 입력하세요" type="text" v-model="searchInput"
        @keyup.enter="searchJobPosting">
      <div class="filter-section">
        <div class="filter-item" @click="onFilterClick(SEARCH_FILTER_TYPES.INDUSTRY)"
          :style="{ color: selectedIndustry === '전체 산업' ? 'black' : '#024CAA' }">
          {{ selectedIndustry }}
        </div>
        <div class="filter-item" @click="onFilterClick(SEARCH_FILTER_TYPES.REGIONS)"
          :style="{ color: selectedProvince === '전체 지역' ? 'black' : '#024CAA' }">
          {{ selectedProvince }}
        </div>
      </div>
      <div class="job-posting-wrap">
        <div class="job-posting-info">{{ jobPostingCount }}건</div>
        <div class="job-posting-list" v-for="jobPosting in jobPostingList" :key="jobPosting.entId">
          <div class="job-posting-header">
            <div class="course-title">{{ jobPosting.entName }}</div>
            <div :class="['process-state', recruitmentPhaseClass(jobPosting.postState)]">
              {{ recruitmentPhase(jobPosting.postState) }}
            </div>
          </div>
          <div class="course-subtitle">{{ jobPosting.postTitle }}</div>
          <div class="course-schedule">
            <div class="schedule-info">{{ jobPosting.entAddr1 }}</div>
            <img src="@/assets/images/icons/rightarrows.png" class="right-arrow-icon" alt="Right Arrow Icon"
              @click="onMoveDetailPageClick(jobPosting.jobPostingId)">
          </div>
        </div>
      </div>
    </div>
  </main>
  <search-filter-modal v-if="modalPopupStatue" @close-modal="modalPopupStatue = false"
    @select-filter="handleSelectFilter" :filter-type="filterTypes" />
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
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.subtitle {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.search-wrap {
  margin-top: 15px;
  margin-bottom: 15px;
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
  margin-right: 10px;
  cursor: pointer;
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
  margin-top: 15px;
  margin-left: 10px;
  margin-bottom: 10px;
}

.job-posting-list {
  background-color: #ffffff;
  border-radius: 15px;
  padding: 20px;
  color: #000000;
  font-weight: bold;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.course-title {
  font-size: 18px;
  margin-bottom: 8px;
}

.course-subtitle {
  margin-bottom: 12px;
  color: #6c757d;
}

.course-schedule {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.schedule-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.right-arrow-icon {
  width: 20px;
  height: auto;
  cursor: pointer;
  margin-left: 15px;
}

@media (max-width: 2000px) {

  /* 전체 레이아웃에서 동일하게 보이도록 스타일 수정 */
  .job-posting-list {
    padding: 15px;
  }

  .course-title {
    font-size: 16px;
  }

  .course-subtitle {
    font-size: 14px;
  }

  .schedule-info {
    font-size: 12px;
  }

  .job-posting-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .process-state {
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 14px;
    color: #ffffff;
    font-weight: bold;
    text-align: center;
    min-width: 70px;
    margin-left: 10px;
  }

  .phase-open {
    background-color: #5B99C2;
  }

  .phase-in-progress {
    background-color: #FF9800;
  }

  .phase-closed {
    background-color: #686D76;
  }
}
</style>
