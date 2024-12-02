<script>
import { onMounted, ref } from "vue";
import SearchFilterModal from "@/components/SearchFilterModal.vue";
import { SEARCH_FILTER_TYPES } from "@/constants/searchFilterTypes";
import { ROUTES } from "@/router/routes";
import { useRouter } from "vue-router";
import { formatDate2 } from "@/utils/formatters";
import handleApiCall from '@/api/apiService';

export default {
  name: "WisdomManagement",
  methods: { formatDate2 },
  computed: {
    SEARCH_FILTER_TYPES() {
      return SEARCH_FILTER_TYPES
    }
  },
  components: { SearchFilterModal },
  setup() {
    const router = useRouter();

    const modalPopupStatue = ref(false);
    const searchInput = ref("");
    const filterTypes = ref("");
    const selectedWarning = ref("경고 필터링");
    const selectedJob = ref("전체 직무");

    const wisdomList = ref();
    const wisdomCount = ref(0);

    const searchWisdom = () => {
      fetchWisdoms();
    }

    const onFilterClick = (filterType) => {
      filterTypes.value = filterType;
      modalPopupStatue.value = true;
    }

    const handleSelectFilter = (selected) => {
      if (selected.filterType === SEARCH_FILTER_TYPES.WARNING) {
        selectedWarning.value = selected.filterValue;
        fetchWisdoms();
      }

      if (selected.filterType === SEARCH_FILTER_TYPES.JOB) {
        selectedJob.value = selected.filterValue;
        fetchWisdoms();
      }
    }

    const fetchWisdoms = async () => {
      try {
        const knowhowReport = (selectedWarning.value === '경고 필터링' || selectedWarning.value === '없음')
          ? null
          : (selectedWarning.value === '많은 순' ? 'desc' : 'asc');

        const response = await handleApiCall('get', '/admin/knowhow', null, {
          params: {
            knowhowTitle: searchInput.value,
            knowhowJob: selectedJob.value === '전체 직무' ? null : selectedJob.value,
            knowhowReport: knowhowReport,
          }
        });

        wisdomList.value = response.data;
        wisdomCount.value = wisdomList.value.length;
      } catch (error) {
        console.error("fetchWisdoms API 호출 오류:", error);
      }
    }

    onMounted(() => {
      fetchWisdoms();
    })

    const onMoveDetailPageClick = (knowhowId) => {
      router.push({
        name: ROUTES.INDIVIDUAL_USER_WISDOM_DETAIL.name,
        params: {
          id: knowhowId
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
      wisdomList,
      wisdomCount,
      searchWisdom,
      onFilterClick,
      handleSelectFilter,
      onMoveDetailPageClick,
    };
  },
}
</script>

<template>
  <main class="body">
    <div class="header">일경험 공유 관리</div>
    <div class="search-wrap">
      <input class="search-input" placeholder="게시물 제목을 검색하세요" type="text" v-model="searchInput"
        @keyup.enter="searchWisdom">
      <div class="filter-section">
        <div class="filter-item" @click="onFilterClick(SEARCH_FILTER_TYPES.WARNING)"
          :style="{ color: selectedWarning === '경고 필터링' ? 'black' : '#024CAA' }">
          {{ selectedWarning }}
        </div>
        <div class="filter-item" @click="onFilterClick(SEARCH_FILTER_TYPES.JOB)"
          :style="{ color: selectedJob === '전체 직무' ? 'black' : '#024CAA' }">
          {{ selectedJob }}
        </div>
      </div>
      <div class="job-wisdom-wrap">
        <div class="job-wisdom-info">{{ wisdomCount }}건</div>
        <div class="job-wisdom-list" v-for="wisdom in wisdomList" :key="wisdom.postId">
          <div class="course-title">{{ wisdom.knowhowTitle }}</div>
          <div class="course-subtitle">{{ wisdom.knowhowJob }}</div>
          <div class="course-schedule">
            <div class="schedule-info">
              <div class="info-item">{{ wisdom.userName }}</div>
              <div class="info-item">신고횟수 : {{ wisdom.reportedCnt }}</div>
              <div class="info-item">{{ formatDate2(new Date(Date.parse(wisdom.uploadDate))) }}</div>
            </div>
            <img src="@/assets/images/icons/rightarrows.png" class="right-arrow-icon" alt="Right Arrow Icon"
              @click="onMoveDetailPageClick(wisdom.knowhowId)">
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
  display: flex;
  justify-content: space-between;
  align-items: center;
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

@media (max-width: 768px) {
  .job-wisdom-list {
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
}
</style>
