<script>
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref } from "vue";
import { ROUTES } from "@/router/routes";
import { formatDate } from "@/utils/format";
import SearchFilterModal from "@/components/SearchFilterModal.vue";
import {SEARCH_FILTER_TYPES} from "@/constants/searchFilterTypes";

export default {
  name: "JobPostingsPage",
  computed: {
    SEARCH_FILTER_TYPES() {
      return SEARCH_FILTER_TYPES
    }
  },
  components: { SearchFilterModal },
    methods: { formatDate },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const viewType = route.params.viewType
    console.log(viewType);

    const modalPopupStatue = ref(false);
    const searchInput = ref("");
    const filterTypes = ref("");
    const selectedProvince = ref("전체 지역");
    const selectedJob = ref("전체 직무");

    const jopPostingCount = ref(0);
    const jobPostingList = ref();

    const searchJopPosting = () => {
      // todo 채용공고 리스트 API 구현 시 아래에 로직 구현 하기
      console.log("검색어:", searchInput.value);
    }

    const fetchJopPosting = () => {
      // todo 채용공고 리스트 API 구현 시 아래에 로직 구현 하기
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
          postState: 'ACTIVE',
        },
      ];

      jobPostingList.value = data;
      jopPostingCount.value = jobPostingList.value.length;
    }

    onMounted(() => {
      fetchJopPosting();
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
      console.log("postId:", postId);
      router.push({
        name: ROUTES.JOB_POSTING_DETAIL.name,
        params:{
          id: postId
        },
      })
    }

    const onFilterClick = (filterType) => {
      filterTypes.value = filterType;
      modalPopupStatue.value = true;
    }

    const handleSelectProvince = (selected) => {
      console.log("선택된 필터:", selected);
      if (selected === SEARCH_FILTER_TYPES.JOB) {
        selectedJob.value = selected.job;
      }

      if (selected === SEARCH_FILTER_TYPES.REGIONS) {
        selectedProvince.value = selected.province;
      }
    }

    return {
      modalPopupStatue,
      filterTypes,
      viewType,
      searchInput,
      selectedJob,
      selectedProvince,
      jopPostingCount,
      jobPostingList,
      recruitmentPhase,
      recruitmentPhaseClass,
      searchJopPosting,
      onMoveDetailPageClick,
      onFilterClick,
      handleSelectProvince,
    };
  }
}
</script>

<template>
  <main class="body">
    <div class="header">채용 공고</div>
    <div class="search-wrap">
      <input
          class="search-input"
          placeholder="기업명을 입력하세요"
          type="text"
          v-model="searchInput"
          @keyup.enter="searchJopPosting"
      >
      <div class="filter-section">
        <div class="filter-item"
             @click="onFilterClick(SEARCH_FILTER_TYPES.JOB)"
             :style="{ color: selectedJob === '전체 직무' ? 'black' : '#024CAA' }">
          전체 직무
        </div>
        <div class="filter-item"
             @click="onFilterClick(SEARCH_FILTER_TYPES.REGIONS)"
             :style="{ color: selectedProvince === '전체 지역' ? 'black' : '#024CAA' }">
          {{ selectedProvince }}
        </div>
      </div>
    </div>
    <div class="recommended-section" v-if="viewType === 'new'">
      <div class="recommended-title">추천 공고</div>
      <div class="recommended-content"></div>
    </div>
    <div class="job-posting-wrap">
      <div class="job-posting-info">{{ jopPostingCount }}건</div>
      <div class="job-posting-list" v-for="jobPosting in jobPostingList" :key="jobPosting">
        <div class="job-posting-list-top">
          <div class="course-title">{{ jobPosting.entName }}</div>
          <div :class="['recruitment-phase', recruitmentPhaseClass(jobPosting.postState)]">{{ recruitmentPhase(jobPosting.postState) }}</div>
        </div>
        <div class="course-subtitle">{{ jobPosting.postTitle }}</div>
        <div class="course-schedule">
          <div class="schedule-info">{{ formatDate(new Date(jobPosting.startDate)) }} ~ {{ formatDate(new Date(jobPosting.endDate)) }}</div>
          <img src="@/assets/images/icons/rightarrows.png" class="right-arrow-icon" alt="Right Arrow Icon" @click="onMoveDetailPageClick(jobPosting.postId)">
        </div>
      </div>
    </div>
  </main>
  <search-filter-modal
      v-if="modalPopupStatue"
      @close-modal="modalPopupStatue = false"
      @select-province="handleSelectProvince"
      :filter-type="filterTypes"
  />
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

.recommended-section {
  margin-top: 10px;
}

.recommended-title {
  font-size: 20px;
  font-weight: bold;
  margin-left: 10px;
  margin-bottom: 10px;
}

.recommended-content {
  background-color: #D9D9D9;
  border-radius: 15px;
  padding: 15px;
  height: 150px;
}
</style>