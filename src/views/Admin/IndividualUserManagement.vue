<script>
import { onMounted, ref } from "vue";
import { SEARCH_FILTER_TYPES } from "@/constants/searchFilterTypes";
import SearchFilterModal from "@/components/SearchFilterModal.vue";
import { formatDate2 } from "@/utils/format";
import { ROUTES } from "@/router/routes";
import { useRouter } from "vue-router";
import { GENDER_TYPES } from "@/constants/genderTypes";
import handleApiCall from '@/api/apiService';

export default {
  name: "IndividualUserManagement",
  methods: { formatDate2 },
  computed: {
    GENDER_TYPES() {
      return GENDER_TYPES
    },
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
    const selectedProvince = ref("전체 지역");

    const individualUserList = ref([]);
    const individualUserCount = ref(0);

    // 검색어 입력 후 Enter 키를 눌렀을 때 호출되는 함수
    const searchWbUser = () => {
      fetchIndividualUsers();
    };

    // 필터 선택 시 호출되는 함수
    const onFilterClick = (filterType) => {
      filterTypes.value = filterType;
      modalPopupStatue.value = true;
    };

    const handleSelectFilter = (selected) => {
      if (selected.filterType === SEARCH_FILTER_TYPES.REGIONS) {
        selectedProvince.value = selected.filterValue;
        // 필터 변경될 때마다 데이터 다시 가져오기
        fetchIndividualUsers();
      }
    };

    const fetchIndividualUsers = async () => {
      try {
        const params = {
          userName: searchInput.value,  // 검색어
          addrCity: selectedProvince.value === '전체 지역' ? null : selectedProvince.value,  // '전체 지역'일 경우 null 처리
        };

        const response = await handleApiCall('get', '/admin/individual', null, {
          params: params
        });

        // console.log(response.data)
        individualUserList.value = response.data;
        individualUserCount.value = response.data.length;

      } catch (error) {
        console.error("fetchIndividualUsers API 호출 오류:", error);
      }
    };

    // 페이지가 로드될 때 기본 데이터를 가져옴
    onMounted(() => {
      fetchIndividualUsers();
    });

    // 사용자 상세 페이지로 이동하는 함수
    const onMoveDetailPageClick = (userId) => {
      router.push({
        name: ROUTES.READONLY_RESUME_PAGE.name,
        params: { id: userId },
      });
    };

    return {
      modalPopupStatue,
      searchInput,
      filterTypes,
      selectedProvince,
      individualUserList,
      individualUserCount,
      searchWbUser,
      onFilterClick,
      handleSelectFilter,
      onMoveDetailPageClick,
    };
  }
};
</script>


<template>
  <main class="body">
    <div class="header">개인회원 관리</div>
    <div class="search-wrap">
      <input class="search-input" placeholder="개인회원 이름을 입력하세요" type="text" v-model="searchInput"
        @keyup.enter="searchWbUser">
      <div class="filter-section">
        <div class="filter-item" @click="onFilterClick(SEARCH_FILTER_TYPES.REGIONS)"
          :style="{ color: selectedProvince === '전체 지역' ? 'black' : '#024CAA' }">
          {{ selectedProvince }}
        </div>
      </div>
      <div class="job-posting-wrap">
        <div class="job-posting-info">{{ individualUserCount }}건</div>
        <div class="job-posting-list" v-for="individualUser in individualUserList" :key="individualUser">
          <div class="job-posting-list-top">
            <div class="course-title">{{ individualUser.name }}</div>
          </div>
          <div class="course-subtitle">{{ individualUser.addr_city }}</div>
          <div class="course-schedule">
            <div class="schedule-info">
              {{ formatDate2(new Date(Date.parse(individualUser.birth))) }}
              ({{ individualUser.gender === GENDER_TYPES.M ? '남자' : '여자' }})
            </div>
            <img src="@/assets/images/icons/rightarrows.png" class="right-arrow-icon" alt="Right Arrow Icon"
              @click="onMoveDetailPageClick(individualUser.userId)">
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
  padding: 20px;
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
  font-size: 18px;
  margin-right: auto;
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