<script>
import {useRouter} from "vue-router";
import {ROUTES} from "@/router/routes";
import SearchFilterModal from "@/components/SearchFilterModal.vue";
import {onMounted, ref} from "vue";
import {SEARCH_FILTER_TYPES} from "@/constants/searchFilterTypes";
import {formatContentTitle, formatContent, formatDate2} from "@/utils/formatters";
import {fetchAllWisdomExplore} from "@/api/services/individualUserService";
import SingleButtonModal from "@/components/SingleButtonModal.vue";

export default {
  name: "WorkExperienceSharing",
  computed: {
    SEARCH_FILTER_TYPES() {
      return SEARCH_FILTER_TYPES
    }
  },
  components: {SingleButtonModal, SearchFilterModal },
  methods: {formatContentTitle, formatContent, formatDate2},
  setup() {
    const router = useRouter();

    const searchFilterModalStatue = ref(false);
    const singleButtonModalStatus = ref(false);
    const modalMessage = ref('');
    const searchInput = ref("");
    const filterTypes = ref("");
    const selectedJob = ref("전체 직무");

    const wisdomCount = ref(0);
    const wisdomList = ref();

    const searchPosts = () => {
      fetchPosts();
    }

    const fetchPosts = async () => {
      try {
        const images = [
          require('@/assets/images/illustrate/flower.png'),
          require('@/assets/images/illustrate/mountain.png'),
          require('@/assets/images/illustrate/see.png'),
          require('@/assets/images/illustrate/sky.jpeg'),
        ];

        const response = await fetchAllWisdomExplore(searchInput.value, selectedJob.value);
        // const response = await fetchAllWisdomShare(searchInput.value, selectedJob.value);

        // 데이터를 불러오면서 각 항목에 이미지를 순환적으로 배정
        wisdomList.value = response.map((item, index) => {
          return {
            ...item,
            image: images[index % images.length],
          };
        });
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

    const onMoveWorkExperienceDetailClick = (postId) => {
      router.push({
        name: ROUTES.WORK_EXPERIENCE_SHARING_DETAIL.name,
        params:{
          id: postId
        },
      });
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

    const onRegisterPostClick = () => {
      router.push(ROUTES.WORK_EXPERIENCE_REGISTRATION.path);
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
      onMoveWorkExperienceDetailClick,
      onFilterClick,
      onRegisterPostClick,
    };
  }
}
</script>

<template>
  <main class="body">
    <div class="header">
      <div class="header-title">일경험 공유하기</div>
      <div class="header-register-job" @click="onRegisterPostClick">등록하기</div>
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
      <div class="experience-board-content">
        <div
            class="experience-board-item"
            v-for="(wisdomShare, index) in wisdomList"
            :key="index"
            @click="onMoveWorkExperienceDetailClick(wisdomShare.knowhowId)"
        >
          <div class="experience-board-image">
            <img :src="wisdomShare.image" alt="직무 이미지" />
          </div>
          <div class="experience-board-text">
            <div class="experience-board-job-title">{{ formatContentTitle(wisdomShare.knowhowTitle)}}</div>
            <div class="experience-board-content">{{ formatContent(wisdomShare.knowhowContent) }}</div>
            <div class="experience-board-role">{{ wisdomShare.knowhowJob}}</div>
          </div>
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

.header-register-job {
  background-color: #024CAA; /* 버튼 배경색 */
  color: white; /* 버튼 텍스트 색 */
  padding: 10px 15px; /* 여백 */
  border-radius: 5px; /* 모서리 둥글게 */
  cursor: pointer; /* 포인터 커서 */
  transition: background-color 0.3s; /* 호버 효과를 위한 전환 */
  font-size: 10pt;
}

.header-register-job:hover {
  background-color: #0056b3; /* 호버 시 배경색 변경 */
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

.experience-board-content {
  display: flex;
  flex-direction: column;
}

.experience-board-item {
  display: flex; /* 텍스트와 이미지를 가로로 배치 */
  align-items: center; /* 세로 가운데 정렬 */
  background-color: #f9f9f9;
  padding: 15px;
  cursor: pointer;
  border-bottom: 1px solid black;
  min-height: 120px; /* 최소 높이 설정 */
  box-sizing: border-box; /* 패딩 포함한 크기 계산 */
}

.experience-board-image {
  flex-shrink: 0; /* 크기를 축소하지 않음 */
  width: 90px; /* 고정 너비 */
  height: 90px; /* 고정 높이 */
  border-radius: 8px; /* 둥근 모서리 */
  overflow: hidden; /* 둥근 경계 밖 이미지를 숨김 */
  margin-right: 15px; /* 텍스트와 이미지 사이 간격 */
}

.experience-board-image img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 이미지를 정사각형에 맞게 채움 */
}

.experience-board-text {
  flex-grow: 1; /* 남은 공간을 모두 차지 */
  overflow: hidden; /* 넘치는 내용 숨김 */
  text-overflow: ellipsis; /* 긴 텍스트 말줄임 처리 */
  white-space: nowrap; /* 한 줄로 표시 */
}

.experience-board-item:not(:last-child) {
  border-bottom: 0; /* 마지막 항목이 아니면 하단 보더 제거 */
}

.experience-board-item + .experience-board-item {
  border-top: 1px solid #ccc; /* 다음 항목과의 경계를 위한 상단 보더 추가 */
}

.experience-board-item:first-child {
  border-top: none; /* 첫 번째 요소는 상단 보더 제거 */
}

.experience-board-item:last-child {
  border-bottom: none; /* 마지막 요소는 하단 보더 제거 */
}

.experience-board-item:hover {
  background-color: #e9ecef;
}

.experience-board-job-title {
  font-size: 15px;
  font-weight: bold;
  color: #333;
}

.experience-board-post-title {
  font-size: 14px;
  font-weight: bold;
  margin-top: 8px;
}

.experience-board-content {
  font-size: 11px;
  color: #666;
  margin-top: 10px;
}

.experience-board-role {
  font-size: 11px;
  font-weight: bold;
  color: #fff; /* 글씨를 흰색으로 설정 */
  background-color: #B7B7B7; /* 회색 배경 추가 */
  margin-top: 8px;
  padding: 4px 8px; /* 안쪽 여백 추가 */
  border-radius: 10px; /* 둥근 모서리 적용 */
  display: inline-block; /* 배경이 텍스트 크기에 맞도록 조절 */
}
</style>