<script>
import {onMounted, ref} from "vue";
import SearchFilterModal from "@/components/SearchFilterModal.vue";
import {SEARCH_FILTER_TYPES} from "@/constants/searchFilterTypes";
import {ROUTES} from "@/router/routes";
import {useRouter} from "vue-router";

export default {
  name: "WisdomManagement",
  computed: {
    SEARCH_FILTER_TYPES() {
      return SEARCH_FILTER_TYPES
    }
  },
  components: {SearchFilterModal},
  setup() {
    const router = useRouter();

    const modalPopupStatue = ref(false);
    const searchInput = ref();
    const filterTypes = ref("");
    const selectedWarning = ref("경고 필터링");
    const selectedJob = ref("전체 직무");

    const postingList = ref();
    const postingCount = ref(0);

    const searchJopPosting = () => {
      // todo API 구현 시 아래에 로직 구현 하기
      console.log("검색어:", searchInput.value);
    }

    const onFilterClick = (filterType) => {
      filterTypes.value = filterType;
      modalPopupStatue.value = true;
    }

    const handleSelectFilter = (selected) => {
      if (selected.filterType === SEARCH_FILTER_TYPES.WARNING) {
        selectedWarning.value = selected.filterValue;
      }

      if (selected.filterType === SEARCH_FILTER_TYPES.JOB) {
        selectedJob.value = selected.filterValue;
      }
    }

    const fetchPosts = () => {
      const data = [
        {
          postId: 1,
          postTitle: '시니어도 할 수 있는 Ghat GPT',
          job: '서비스',
          date: '2024.01.01',
          userId: 'user01'
        },
        {
          postId: 2,
          postTitle: '시니어도 할 수 있는 EXCEL',
          job: 'IT',
          date: '2024.01.01',
          userId: 'user02'
        },
      ];

      postingList.value = data;
      postingCount.value = postingList.value.length;
    }

    onMounted(() => {
      fetchPosts();
    })

    const onMoveDetailPageClick = (postId) => {
      console.log("postId:", postId);
      router.push({
        name: ROUTES.WISDOM_EXPLORE_DETAIL.name,
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
      selectedWarning,
      selectedJob,
      postingList,
      postingCount,
      searchJopPosting,
      onFilterClick,
      handleSelectFilter,
      onMoveDetailPageClick,
    };
  },
}
</script>

<template>
  <main class="body">
    <div class="header">지혜마당 관리</div>
    <div class="search-wrap">
      <input
          class="search-input"
          placeholder="게시물 제목을 검색하세요"
          type="text"
          v-model="searchInput"
          @keyup.enter="searchJopPosting"
      >
      <div class="filter-section">
        <div class="filter-item"
             @click="onFilterClick(SEARCH_FILTER_TYPES.WARNING)"
             :style="{ color: selectedWarning === '경고 필터링' ? 'black' : '#024CAA' }">
          {{ selectedWarning }}
        </div>
        <div class="filter-item"
             @click="onFilterClick(SEARCH_FILTER_TYPES.JOB)"
             :style="{ color: selectedJob === '전체 직무' ? 'black' : '#024CAA' }">
          {{ selectedJob }}
        </div>
      </div>
      <div class="job-posting-wrap">
        <div class="job-posting-info">{{ postingCount }}건</div>
        <div class="job-posting-list" v-for="posting in postingList" :key="posting">
          <div class="course-title">{{ posting.postTitle }}</div>
          <div class="course-subtitle">{{ posting.job }}</div>
          <div class="course-schedule">
            <div class="schedule-info">{{ posting.userId }} &nbsp;&nbsp;&nbsp; {{ posting.date }}</div>
            <img src="@/assets/images/icons/rightarrows.png" class="right-arrow-icon" alt="Right Arrow Icon" @click="onMoveDetailPageClick(posting.postId)">
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