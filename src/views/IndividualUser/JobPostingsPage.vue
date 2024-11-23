<script>
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref } from "vue";
import { ROUTES } from "@/router/routes";
import { formatDate1 } from "@/utils/formatters";
import SearchFilterModal from "@/components/SearchFilterModal.vue";
import { SEARCH_FILTER_TYPES } from "@/constants/searchFilterTypes";
import {
  fetchJobPostingsCareer,
  fetchJobPostingsNew,
  fetchJobPostings,
  fetchJobPostingsRecommend
} from "@/api/services/individualUserService";
import JobPostingInfoModal from "@/components/JobPostingInfoModal.vue";

export default {
  name: "JobPostingsPage",
  computed: {
    SEARCH_FILTER_TYPES() {
      return SEARCH_FILTER_TYPES
    }
  },
  components: {JobPostingInfoModal, SearchFilterModal },
  methods: { formatDate1 },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const viewType = ref(route.params.viewType || 'all');
    const modalPopupStatue = ref(false);
    const jobPostingInfoOverlayStatus = ref(true);
    const searchInput = ref("");
    const filterTypes = ref("");
    const selectedProvince = ref("전체 지역");
    const selectedJob = ref("전체 직무");

    const jobPostingCount = ref(0);
    const jobPostingList = ref();
    const jobPostingRecommendList = ref();

    const getFormattedValue = (value, defaultValue) => {
      return value === defaultValue ? null : value;
    };

    const searchJobPosting = () => {
      fetchJobPosting('all');
      console.log("검색어:", searchInput.value);
    }

    const fetchJobPosting = async (viewType) => {
      let payload = {
        entName: searchInput.value,
        jobName: getFormattedValue(selectedJob.value, "전체 직무"),
        entAddr1: getFormattedValue(selectedProvince.value, "전체 지역")
      };

      let response;

      try {
        if (viewType === 'career') {
          // 1. 경력 살려 일 찾기 - 경력직종 불러오기
          console.log("경력 살리기");
          response = await fetchJobPostingsCareer();
        } else if (viewType === 'new') {
          console.log("새로운 일 찾기");
          // 2. 새로운 일 찾기 - 관심직종 불러오기
          response = await fetchJobPostingsNew();
          const recommendResponse = await fetchJobPostingsRecommend();
          jobPostingRecommendList.value = recommendResponse
        } else {
          // 3. 전체 공고 조회
          console.log("전체")
          response = await fetchJobPostings(payload);
        }

        // API 응답 데이터 할당
        jobPostingList.value = response || []; // 데이터가 없을 경우 빈 배열 할당
        jobPostingCount.value = jobPostingList.value.length;

      } catch (error) {
        console.error("Error fetching job postings:", error);
        jobPostingList.value = [];
        jobPostingCount.value = 0;
      }
    };

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
        params: {
          postId: postId,
        },
      })
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
      fetchJobPosting();
    }

    const recommendedContent = ref(null);
    const isDragging = ref(false);
    const startX = ref(0);
    const scrollLeft = ref(0);

    // 드래그 시작 (웹에서 적용)
    const startDragging = (event) => {
      if (!recommendedContent.value) return;
      isDragging.value = true;
      startX.value = event.pageX - recommendedContent.value.offsetLeft;
      scrollLeft.value = recommendedContent.value.scrollLeft;
    };

    // 드래그 중 (웹에서 적용)
    const onDragging = (event) => {
      if (!isDragging.value || !recommendedContent.value) return;
      const x = event.pageX - recommendedContent.value.offsetLeft;
      const walk = x - startX.value;
      recommendedContent.value.scrollLeft = scrollLeft.value - walk;
    };

    // 드래그 종료 (웹에서 적용)
    const stopDragging = () => {
      isDragging.value = false;
    };

    const showJobPostingInfoOverlay = () => {
      if (viewType.value === 'career' || viewType.value === 'new') {
        jobPostingInfoOverlayStatus.value = true;
      } else {
        jobPostingInfoOverlayStatus.value = false;
      }
    }

    // Lifecycle Hook: 추가적인 DOM 확인은 필요 없지만 안전하게 작성
    onMounted(() => {
      showJobPostingInfoOverlay();

      if (!recommendedContent.value) {
        console.warn("recommendedContent is not initialized properly.");
      }

      fetchJobPosting(viewType.value);
    });

    return {
      modalPopupStatue,
      jobPostingInfoOverlayStatus,
      filterTypes,
      viewType,
      searchInput,
      selectedJob,
      selectedProvince,
      jobPostingCount,
      jobPostingList,
      jobPostingRecommendList,
      recommendedContent,
      recruitmentPhase,
      recruitmentPhaseClass,
      searchJobPosting,
      onMoveDetailPageClick,
      onFilterClick,
      handleSelectFilter,
      startDragging,
      onDragging,
      stopDragging,
    };
  }
}
</script>

<template>
  <main class="body">
    <div class="header">채용 공고</div>
    <div class="search-wrap">
      <input class="search-input" placeholder="기업명을 입력하세요" type="text" v-model="searchInput"
             @keyup.enter="searchJobPosting">
      <div class="filter-section">
        <div class="filter-item" @click="onFilterClick(SEARCH_FILTER_TYPES.JOB)"
             :style="{ color: selectedJob === '전체 직무' ? 'black' : '#024CAA' }">
          {{ selectedJob }}
        </div>
        <div class="filter-item" @click="onFilterClick(SEARCH_FILTER_TYPES.REGIONS)"
             :style="{ color: selectedProvince === '전체 지역' ? 'black' : '#024CAA' }">
          {{ selectedProvince }}
        </div>
      </div>
    </div>
    <div class="recommended-section" v-if="viewType === 'new'">
      <div class="recommended-title">추천 공고</div>
      <div
          ref="recommendedContent"
          class="recommended-content"
          @mousedown="startDragging"
          @mousemove="onDragging"
          @mouseup="stopDragging"
          @mouseleave="stopDragging"
      >
        <div
            class="recommended-item"
            v-for="(jobPostingRecommend, index) in jobPostingRecommendList"
            :key="index"
        >
          <div class="item-image">
            <img :src="jobPostingRecommend.postImg" alt="Job image" />
          </div>
          <div class="item-text">
            <div class="item-company">{{ jobPostingRecommend.entName }}</div>
            <div class="item-title">{{ jobPostingRecommend.postTitle }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="job-posting-wrap">
      <div class="job-posting-info">{{ jobPostingCount }}건</div>
      <div class="job-posting-list" v-for="jobPosting in jobPostingList" :key="jobPosting">
        <div class="job-posting-list-top">
          <div class="course-title">{{ jobPosting.entName }}</div>
          <div :class="['recruitment-phase', recruitmentPhaseClass(jobPosting.postState)]">
            {{ recruitmentPhase(jobPosting.postState) }}
          </div>
        </div>
        <div class="course-subtitle">{{ jobPosting.postTitle }}</div>
        <div class="course-schedule">
          <div class="schedule-info">{{ jobPosting.jobName }}</div>
          <img src="@/assets/images/icons/rightarrows.png" class="right-arrow-icon" alt="Right Arrow Icon"
               @click="onMoveDetailPageClick(jobPosting.jobPostingId)">
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
  <job-posting-info-modal
      v-if="jobPostingInfoOverlayStatus"
      @close-modal="jobPostingInfoOverlayStatus = false"
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
  /* Aligns items on both ends */
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
  margin-bottom: 12px;
  color: #6c757d;
  font-size: 11pt;
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
  margin-top: 30px;
}

.recommended-content {
  display: flex;
  overflow-x: auto; /* 수평 스크롤 활성화 */
  scrollbar-width: none;
}

.recommended-content::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}

.recommended-item {
  flex: 0 0 calc(33.33% - 30px); /* 화면 너비의 약 1/3 사용, 간격 고려 */
  max-width: 300px; /* 최대 너비 제한 */
  min-width: 200px; /* 최소 너비 제한 */
  border-radius: 15px;
  padding: 10px;
  text-align: center;
}

.recommended-section .item-image {
  width: 100%;
  height: 120px;
  border-radius: 10px; /* 둥근 모서리 */
  background-color: #f0f0f0; /* 이미지가 없을 때를 대비한 배경색 */
  display: flex; /* 이미지와 텍스트를 별도로 정렬 가능하게 */
  justify-content: center;
  align-items: center;
  overflow: hidden; /* 둥근 모서리 안에 이미지를 잘라내기 */
}

.recommended-section .item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 이미지 비율 유지하며 채우기 */
}

.recommended-section .item-text {
  margin-top: 10px; /* 이미지 아래에 여백 */
  text-align: center; /* 텍스트를 가운데 정렬 */
}

.recommended-section .item-title {
  font-size: 16px;
  font-weight: bold;
  margin-top: 10px;
}

.recommended-section .item-company {
  font-size: 14px;
  color: #555;
  margin-top: 5px;
}
</style>