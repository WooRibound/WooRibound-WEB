<script>
import {useRouter} from "vue-router";
import {ROUTES} from "@/router/routes";
import SearchFilterModal from "@/components/SearchFilterModal.vue";
import {onMounted, ref} from "vue";
import {SEARCH_FILTER_TYPES} from "@/constants/searchFilterTypes";
import {formatDate2} from "@/utils/formatters";
import {fetchAllWisdomShare} from "@/api/services/individualUserService";
import SingleButtonModal from "@/components/SingleButtonModal.vue";

export default {
  name: "MyWorkExperiencePage",
  computed: {
    SEARCH_FILTER_TYPES() {
      return SEARCH_FILTER_TYPES
    }
  },
  components: {SingleButtonModal, SearchFilterModal },
  methods: {formatDate2},
  setup() {
    const router = useRouter();

    const searchFilterModalStatue = ref(false);
    const singleButtonModalStatus = ref(false);
    const modalMessage = ref('');
    const searchInput = ref("");
    const filterTypes = ref("");
    const selectedJob = ref("전체 직무");

    const wisdomList = ref();
    const wisdomCount = ref(0);

    const searchPosts = () => {
      fetchPosts();
    }

    const fetchPosts = async () => {
      try {
        const response = await fetchAllWisdomShare(searchInput.value, selectedJob.value);
        wisdomList.value = response;
        wisdomCount.value = wisdomList.value.length;
      } catch (error) {
        console.error('Error data:', error);
        modalMessage.value = '오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
        singleButtonModalStatus.value = true;
      }

    }

    onMounted(() => {
      fetchPosts();
    })

    const onMoveDetailPageClick = (postId) => {
      router.push({
        name: ROUTES.MY_WORK_EXPERIENCE_DETAIL.name,
        params:{
          id: postId
        },
      })
    }

    const onFilterClick = (filterType) => {
      filterTypes.value = filterType;
      searchFilterModalStatue.value = true;
    }

    const handleSelectFilter = (selected) => {
      if (selected.filterType === SEARCH_FILTER_TYPES.JOB) {
        selectedJob.value = selected.filterValue;
      }
      fetchPosts();
    }

    return {
      searchFilterModalStatue,
      singleButtonModalStatus,
      modalMessage,
      searchInput,
      filterTypes,
      selectedJob,
      wisdomCount,
      wisdomList,
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
      <div class="header-title">내가 쓴 글</div>
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
    <div class="job-wisdom-wrap">
      <div class="job-wisdom-info">{{ wisdomCount }}건</div>
      <div class="job-wisdom-list" v-for="wisdom in wisdomList" :key="wisdom">
        <div class="course-title">{{ wisdom.knowhowTitle }}</div>
        <div class="course-subtitle">{{ wisdom.knowhowJob }}</div>
        <div class="course-schedule">
          <div class="schedule-info">
            <div class="info-item">{{ wisdom.userName }}</div>
            <div class="info-item">{{ formatDate2(wisdom.uploadDate) }}</div>
          </div>
          <img
              src="@/assets/images/icons/rightarrows.png"
              class="right-arrow-icon"
              alt="Right Arrow Icon"
              @click="onMoveDetailPageClick(wisdom.knowhowId)"
          >
        </div>
      </div>
    </div>
  </main>
  <search-filter-modal
      v-if="searchFilterModalStatue"
      @close-modal="searchFilterModalStatue = false"
      @select-filter="handleSelectFilter"
      :filter-type="filterTypes"
  />
  <single-button-modal
      v-if="singleButtonModalStatus"
      @close-modal="singleButtonModalStatus = false"
      :modal-message="modalMessage"
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

.job-wisdom-wrap {
  margin-top: 10px;
}

.job-wisdom-info {
  font-size: 20px;
  font-weight: bold;
  margin-top: 15px;
  margin-left: 10px;
  margin-bottom: 10px;
}

.job-wisdom-list {
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
  margin-right: auto; /* Ensures it stays on the left */
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

.info-item {
  margin-right: 20px;
  font-size: 14px;
  color: #6c757d;
  font-weight: normal;
}

.right-arrow-icon {
  width: 20px;
  height: auto;
  cursor: pointer;
  margin-left: 15px;
}
</style>