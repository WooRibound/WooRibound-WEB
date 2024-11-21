<script>
import {useRouter} from "vue-router";
import {ROUTES} from "@/router/routes";
import SearchFilterModal from "@/components/SearchFilterModal.vue";
import {onMounted, ref} from "vue";
import {SEARCH_FILTER_TYPES} from "@/constants/searchFilterTypes";
import {formatDate2} from "@/utils/formatters";
import {fetchAllWisdomExplore} from "@/api/services/individualUserService";

export default {
  name: "WisdomExplore",
  computed: {
    SEARCH_FILTER_TYPES() {
      return SEARCH_FILTER_TYPES
    }
  },
  components: { SearchFilterModal },
  methods: {formatDate2},
  setup() {
    const router = useRouter();

    const modalPopupStatue = ref(false);
    const searchInput = ref("");
    const filterTypes = ref("");
    const selectedJob = ref("전체 직무");

    const postingList = ref();
    const postingCount = ref(0);

    const searchPosts = () => {
      // todo API 구현 시 아래에 로직 구현 하기
      console.log("검색어:", searchInput.value);
    }

    const fetchPosts = async () => {
      try {
        const response = await fetchAllWisdomExplore(searchInput.value, selectedJob.value);
        postingList.value = response;
        postingCount.value = postingList.value.length;
      } catch (error) {
        console.error('Error data:', error);
        throw error;
      }

    }

    onMounted(() => {
      fetchPosts();
    })

    const onMoveDetailPageClick = (postId) => {
      router.push({
        name: ROUTES.WISDOM_EXPLORE_DETAIL.name,
        params:{
          id: postId
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
      fetchPosts();
    }

    return {
      modalPopupStatue,
      searchInput,
      filterTypes,
      selectedJob,
      postingCount,
      postingList,
      handleSelectFilter,
      searchPosts,
      onMoveDetailPageClick,
      onFilterClick,
    };
  }
}
</script>

<template>
  <main class="body">
    <div class="header">
      <div class="header-title">지혜 탐색</div>
    </div>
    <div class="search-wrap">
      <input
          class="search-input"
          placeholder="게시물 제목을 입력하세요"
          type="text"
          v-model="searchInput"
          @keyup.enter="searchPosts"
      >
      <div class="filter-section">
        <div class="filter-item"
             @click="onFilterClick(SEARCH_FILTER_TYPES.JOB)"
             :style="{ color: selectedJob === '전체 직무' ? 'black' : '#024CAA' }">
          {{ selectedJob }}
        </div>
      </div>
    </div>
    <div class="job-posting-wrap">
      <div class="job-posting-info">{{ postingCount }}건</div>
      <div class="job-posting-list" v-for="posting in postingList" :key="posting">
        <div class="course-title">{{ posting.knowhowTitle }}</div>
        <div class="course-subtitle">{{ posting.knowhowJob }}</div>
        <div class="course-schedule">
          <div class="schedule-info">{{ posting.userName }} &nbsp;&nbsp;&nbsp; {{ formatDate2(posting.uploadDate) }}</div>
          <img src="@/assets/images/icons/rightarrows.png" class="right-arrow-icon" alt="Right Arrow Icon" @click="onMoveDetailPageClick(posting.knowhowId)">
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
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f8f9fa;
  overflow-y: auto;
}

.header {
  display: flex;
  justify-content: space-between; /* 두 요소를 양 끝에 배치 */
  align-items: center; /* 세로 정렬을 가운데로 */
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
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
  height: 16px;
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