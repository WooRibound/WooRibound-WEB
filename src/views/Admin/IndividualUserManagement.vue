<script>
import {onMounted, ref} from "vue";
import {SEARCH_FILTER_TYPES} from "@/constants/searchFilterTypes";
import SearchFilterModal from "@/components/SearchFilterModal.vue";
import {formatDate2} from "@/utils/format";
import {ROUTES} from "@/router/routes";
import {useRouter} from "vue-router";
import {GENDER_TYPES} from "@/constants/genderTypes";

export default {
  name: "IndividualUserManagement",
  methods: {formatDate2},
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

    const individualUserList = ref();
    const individualUserCount = ref(0);

    const searchJopPosting = () => {
      // todo API 구현 시 아래에 로직 구현 하기
      console.log("검색어:", searchInput.value);
    }

    const onFilterClick = (filterType) => {
      filterTypes.value = filterType;
      modalPopupStatue.value = true;
    }

    const handleSelectFilter = (selected) => {
      if (selected.filterType === SEARCH_FILTER_TYPES.REGIONS) {
        selectedProvince.value = selected.filterValue;
      }
    }

    const fetchIndividualUsers = () => {
      const data = [
        {
          userId: 'USER001',
          name: 'John Doe',
          birthday: '1985-05-20',
          gender: 'M',
          phone: '010-1234-5678',
          user_email: '2024-11-01',
          addr_city: 'Seoul',
          addr_province: 'Seoul',
          job_point: 10,
        },
        {
          userId: 'USER002',
          name: 'John Doe2',
          birthday: '1985-05-20',
          gender: 'F',
          phone: '010-1234-5678',
          user_email: '2024-11-01',
          addr_city: '서울광역시',
          addr_province: '서울시',
          job_point: 10,
        },
      ];

      individualUserList.value = data;
      individualUserCount.value = individualUserList.value.length;
    }

    onMounted(() => {
      fetchIndividualUsers();
    })

    const onMoveDetailPageClick = (userId) => {
      console.log("userId:", userId);
      router.push({
        name: ROUTES.READONLY_RESUME_PAGE.name,
        params:{
          id: userId
        },
      })
    }

    return {
      modalPopupStatue,
      searchInput,
      filterTypes,
      selectedProvince,
      individualUserList,
      individualUserCount,
      searchJopPosting,
      onFilterClick,
      handleSelectFilter,
      onMoveDetailPageClick,
    };
  }
}
</script>

<template>
  <main class="body">
    <div class="header">개인회원 관리</div>
    <div class="search-wrap">
      <input
          class="search-input"
          placeholder="개인회원 이름을 입력하세요"
          type="text"
          v-model="searchInput"
          @keyup.enter="searchJopPosting"
      >
      <div class="filter-section">
        <div class="filter-item"
             @click="onFilterClick(SEARCH_FILTER_TYPES.REGIONS)"
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
              {{ formatDate2(new Date(individualUser.birthday)) }}
              ({{ individualUser.gender === GENDER_TYPES.M ? '남자' : '여자' }})
            </div>
            <img src="@/assets/images/icons/rightarrows.png" class="right-arrow-icon" alt="Right Arrow Icon" @click="onMoveDetailPageClick(individualUser.userId)">
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