<script>
import { onMounted, ref } from "vue";
import { SEARCH_FILTER_TYPES } from "@/constants/searchFilterTypes";
import SearchFilterModal from "@/components/SearchFilterModal.vue";
import { useRouter } from "vue-router";
import { ROUTES } from "@/router/routes";
import handleApiCall from '@/api/apiService';

export default {
  name: "CorporateUsersManagement",
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
    const corporateUserList = ref();
    const corporateUserCount = ref(0);

    const searchCorporate = () => {
      fetchCorporateUsers();
    }

    const onFilterClick = (filterType) => {
      filterTypes.value = filterType;
      modalPopupStatue.value = true;
    }

    const handleSelectFilter = (selected) => {
      if (selected.filterType === SEARCH_FILTER_TYPES.INDUSTRY) {
        selectedIndustry.value = selected.filterValue;
        fetchCorporateUsers();
      }

      if (selected.filterType === SEARCH_FILTER_TYPES.REGIONS) {
        selectedProvince.value = selected.filterValue;
        fetchCorporateUsers();
      }
    }

    const fetchCorporateUsers = async () => {
      try {
        const params = {
          entName: searchInput.value,
          entField: selectedIndustry.value === '전체 산업' ? null : selectedIndustry.value,
          addrCity: selectedProvince.value === '전체 지역' ? null : selectedProvince.value,
        };

        const response = await handleApiCall('get', '/admin/enterprise', null, {
          params: params
        });


        corporateUserList.value = response.data;
        corporateUserCount.value = corporateUserList.value.length;

      } catch (error) {
        console.error("fetchIndividualUsers API 호출 오류:", error);
      }
    }

    onMounted(() => {
      fetchCorporateUsers();
    })

    const onMoveDetailPageClick = (entId) => {
      console.log("entId:", entId);
      router.push({
        name: ROUTES.CORPORATE_USER_PROFILE_READONLY.name,
        params: {
          id: entId
        },
      })
    }

    return {
      modalPopupStatue,
      searchInput,
      filterTypes,
      selectedProvince,
      selectedIndustry,
      corporateUserList,
      corporateUserCount,
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
    <div class="subtitle">기업회원 조회</div>
    <div class="search-wrap">
      <input class="search-input" placeholder="기업명을 입력하세요" type="text" v-model="searchInput"
        @keyup.enter="searchCorporate">
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
        <div class="job-posting-info">{{ corporateUserCount }}건</div>
        <div class="job-posting-list" v-for="corporateUser in corporateUserList" :key="corporateUser">
          <div class="job-posting-list-top">
            <div class="course-title">{{ corporateUser.entName }}</div>
          </div>
          <div class="course-subtitle">{{ corporateUser.entField }}</div>
          <div class="course-schedule">
            <div class="schedule-info">{{ corporateUser.addrCity }}</div>
            <img src="@/assets/images/icons/rightarrows.png" class="right-arrow-icon" alt="Right Arrow Icon"
              @click="onMoveDetailPageClick(corporateUser.userId)">
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
  /* 가변 영역, 헤더와 바텀 내비게이션을 제외한 나머지 공간 차지 */
  padding: 20px;
  /* 내부 여백 */
  box-sizing: border-box;
  /* 패딩을 포함한 크기 계산 */
  background-color: #f8f9fa;
  /* 배경색 */
  overflow-y: auto;
  /* 내용이 넘칠 경우 스크롤 가능 */
}

.header {
  font-size: 24px;
  /* 헤더 폰트 크기 */
  font-weight: bold;
  /* 헤더 두껍게 */
  margin-bottom: 20px;
  /* 아래쪽 여백 */
}

.subtitle {
  /* 소제목 스타일 */
  font-size: 18px;
  /* 글자 크기 */
  font-weight: bold;
  /* 글자 두께 */
  margin-bottom: 10px;
  /* 아래쪽 여백 */
  color: #333;
  /* 텍스트 색상 */
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
  justify-content: space-between;
  /* Aligns items on both ends */
  align-items: center;
  margin-bottom: 5px;
}

.course-title {
  font-size: 18px;
  margin-right: auto;
  /* Ensures it stays on the left */
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