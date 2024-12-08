<script>

import {computed, onMounted, ref, watch} from "vue";
import {fetchLatest4WisdomShare, fetchRecentJobPostings} from "@/api/services/individualUserService";
import {ROUTES} from "@/router/routes";
import {useRouter} from "vue-router";
import {useUserStore} from "@/stores/userStore";
import {USER_TYPES} from "@/constants/userTypes";
import {formatContent, formatContentTitle} from "@/utils/formatters";

export default {
  name: "MainView",
  computed: {
    USER_TYPES() {
      return USER_TYPES
    }
  },
  data() {
    const router = useRouter();
    const userStore = useUserStore();

    const individualServiceGuideList = ref([
      {
        title: "경력 살려서 일자리 찾기",
        subtitle: "경력을 살려보는건 어때요?",
        img: require('@/assets/images/icons/career.png'),
        route: ROUTES.JOB_POSTINGS_PAGE.name,
        viewType: 'career',
        backgroundColor: '#F2EED7'
      },
      {
        title: "관심사에 맞는 새로운 일자리 찾기",
        subtitle: "우바가 당신의 도전을 응원합니다 😍",
        img: require('@/assets/images/icons/new.png'),
        route: ROUTES.JOB_POSTINGS_PAGE.name,
        viewType: 'new',
        backgroundColor: '#F5EFFF'
      },
      {
        title: "일경험 커뮤니티로 모여라",
        subtitle: "다양한 일자리 이야기 나눠봐요!",
        img: require('@/assets/images/icons/question.png'),
        route: ROUTES.MY_WORK_EXPERIENCE_PAGE.name,
        viewType: '',
        backgroundColor: '#C9E6F0'
      },
    ]);

    const corporateServiceGuideList = ref([
      {
        title: "프리미엄 패키지 가입하기",
        subtitle: "프리미엄 가입하고 원하는 인재를 찾아볼까?",
        img: require('@/assets/images/icons/findPeople.png'),
        route: ROUTES.PREMIUM_PACKAGE.name,
        viewType: '',
        backgroundColor: '#F2EED7'
      },
      {
        title: "공고 등록 손쉽게 하기",
        subtitle: "공고 등록 하러가자!",
        img: require('@/assets/images/icons/job_register.png'),
        route: ROUTES.JOB_POSTING_MANAGEMENT.name,
        viewType: '',
        backgroundColor: '#F5EFFF'
      },
      {
        title: "우바에서 채용한 직원 한눈에 보기",
        subtitle: "우바에서 몇 명이나 채용 되었을까?",
        img: require('@/assets/images/icons/wb_employee.png'),
        route: ROUTES.EMPLOYEE_MANAGEMENT.name,
        viewType: '',
        backgroundColor: '#C9E6F0'
      },
    ]);

    const userType = computed(() => userStore.getCurrentUserType);
    const recentJobPostingList = ref();
    const currentSlide = ref(0);

    const fetchJobPosting = async () => {
      try {
        const recentResponse = await fetchRecentJobPostings();
        recentJobPostingList.value = recentResponse;
      } catch (e) {
        console.log(e);
      }
    };

    const wisdomShareList = ref([]);

    const fetchWisdomShare = async () => {
      const images = [
        require('@/assets/images/illustrate/flower.png'),
        require('@/assets/images/illustrate/mountain.png'),
        require('@/assets/images/illustrate/see.png'),
        require('@/assets/images/illustrate/sky.jpeg'),
      ];

      const response = await fetchLatest4WisdomShare();

      wisdomShareList.value = response.map((item, index) => ({
        userName: item.userName,
        knowhowId: item.knowhowId,
        knowhowJob: item.knowhowJob,
        knowhowTitle: formatContentTitle(item.knowhowTitle),
        knowhowContent: formatContent(item.knowhowContent),
        uploadDate: item.uploadDate,
        image: images[index],
      }));

    }

    // 슬라이드 변경 함수
    const changeSlide = () => {
      currentSlide.value = (currentSlide.value + 1) % individualServiceGuideList.value.length;
    };

    // 자동 슬라이드 변경: 1초마다 슬라이드 변경
    let slideInterval;
    const startAutoSlide = () => {
      slideInterval = setInterval(changeSlide, 3000);
    };

    const stopAutoSlide = () => {
      clearInterval(slideInterval);
    };

    const handleSlideTouch = (index) => {
      currentSlide.value = index;

      if (userType.value === USER_TYPES.CORPORATE_MEMBER) {
        router.push({
          name: corporateServiceGuideList.value[index].route,
        });
        return;
      }

      if (individualServiceGuideList.value[index].route === ROUTES.MY_WORK_EXPERIENCE_PAGE.name) {
        router.push({
          name: individualServiceGuideList.value[index].route,
        });
      } else {
        router.push({
          name: individualServiceGuideList.value[index].route,
          params: {
            viewType: individualServiceGuideList.value[index].viewType,
          }
        });
      }

    };

    const onMoveDetailPageClick = (postId) => {
      if (userType.value === USER_TYPES.CORPORATE_MEMBER) {
        router.push({
          name: ROUTES.CORPORATE_USER_JOB_POSTING_DETAIL.name,
          params: {
            postId: postId
          },
        });
        return;
      }

      router.push({
        name: ROUTES.JOB_POSTING_DETAIL.name,
        params: {
          postId: postId
        },
      });

    };

    onMounted(() => {
      fetchJobPosting();
      fetchWisdomShare();
      startAutoSlide();
    });

    // 서비스 가이드 항목을 클릭하거나 터치하면 자동 슬라이드 멈춤
    watch(currentSlide, () => {
      stopAutoSlide();
      startAutoSlide();
    });

    const onViewAllClick = () => {
      router.push({
        name: ROUTES.JOB_POSTINGS_PAGE.name,
        params: {
          viewType: 'new',
        },
      });
    }

    const onMoveWisdomPageClick = () => {
      router.push({
        name: ROUTES.WORK_EXPERIENCE_SHARING.name
      });
    }

    const onMoveWorkExperienceDetailClick = (postId) => {
      router.push({
        name: ROUTES.WORK_EXPERIENCE_SHARING_DETAIL.name,
        params:{
          id: postId
        },
      });
    }

    return {
      individualServiceGuideList,
      corporateServiceGuideList,
      userType,
      recentJobPostingList,
      wisdomShareList,
      currentSlide,
      handleSlideTouch,
      onMoveDetailPageClick,
      onViewAllClick,
      onMoveWisdomPageClick,
      onMoveWorkExperienceDetailClick,
    }
  },
}
</script>

<template>
  <main class="body">
    <div class="content">
      <!-- 기업 유저 서비스 안내 슬라이드 -->
      <div class="service-guide-section" v-if="userType === USER_TYPES.CORPORATE_MEMBER">
        <div
            class="service-guide-item"
            :style="{ transform: `translateX(-${currentSlide * 100}%)`,
                      backgroundColor: serviceGuide.backgroundColor
                    }"
            v-for="(serviceGuide, index) in corporateServiceGuideList"
            :key="index"
            @click="handleSlideTouch(index)"
        >
          <div class="service-guide-img">
            <img :src="serviceGuide.img" alt="service image"/>
          </div>
          <div class="service-guide-text">
            <div class="service-guide-subtitle">{{ serviceGuide.subtitle }}</div>
            <div class="service-guide-title">{{ serviceGuide.title }}</div>
          </div>
        </div>
      </div>

      <!-- 개인 유저 서비스 안내 슬라이드 -->
      <div class="service-guide-section" v-else>
        <div
            class="service-guide-item"
            :style="{ transform: `translateX(-${currentSlide * 100}%)`,
                      backgroundColor: serviceGuide.backgroundColor
                    }"
            v-for="(serviceGuide, index) in individualServiceGuideList"
            :key="index"
            @click="handleSlideTouch(index)"
        >
          <div class="service-guide-img">
            <img :src="serviceGuide.img" alt="service image"/>
          </div>
          <div class="service-guide-text">
            <div class="service-guide-subtitle">{{ serviceGuide.subtitle }}</div>
            <div class="service-guide-title">{{ serviceGuide.title }}</div>
          </div>
        </div>
      </div>

      <!-- 최신 공고 슬라이드 -->
      <div class="slider-section">
        <div class="slider-header">
          <div class="slider-title">😆️ 경력 살려서 일자리 구하기</div>
          <div class="view-all-div" @click="onViewAllClick">모두보기</div>
        </div>
        <div class="slider-content">
          <div
              class="slider-item"
              v-for="(recentJobPosting, index) in recentJobPostingList"
              :key="index"
              @click="onMoveDetailPageClick(recentJobPosting.jobPostingId)"
          >
            <div class="item-image">
              <img :src="recentJobPosting.postImg" alt="Job image" />
            </div>
            <div class="item-text">
              <div class="item-company">{{ recentJobPosting.entName }}</div>
              <div class="item-title">{{ recentJobPosting.postTitle }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 일 경험 공유 게시판 -->
      <div class="experience-board-section">
        <div class="experience-board-header">
          <div class="experience-board-title">🌳 다양한 직무이야기 탐색하기</div>
          <div class="experience-board-view-all" @click="onMoveWisdomPageClick">모두보기</div>
        </div>
        <div class="experience-board-content">
          <div
              class="experience-board-item"
              v-for="(wisdomShare, index) in wisdomShareList"
              :key="index"
              @click="onMoveWorkExperienceDetailClick(wisdomShare.knowhowId)"
          >
            <div class="experience-board-image">
              <img :src="wisdomShare.image" alt="직무 이미지" />
            </div>
            <div class="experience-board-text">
              <div class="experience-board-job-title">{{ wisdomShare.knowhowTitle}}</div>
              <div class="experience-board-content">{{ wisdomShare.knowhowContent}}</div>
              <div class="experience-board-role">{{ wisdomShare.knowhowJob}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.content {
  max-width: 800px;
  margin: 0 auto;
}

.service-guide-section {
  display: flex;
  overflow: hidden; /* 슬라이드 영역 넘치지 않도록 숨김 */
  position: relative;
  width: 95%; /* 화면의 90% 차지 */
  margin: 0 auto; /* 중앙 정렬 */
  height: 65px; /* 높이는 60px */
}

.service-guide-item {
  flex: 0 0 100%; /* 각 슬라이드가 전체 너비 차지 */
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.5s ease; /* 슬라이드 전환 애니메이션 */
  border-radius: 10px;
}

.service-guide-item .service-guide-text {
  display: flex;
  flex-direction: column; /* 수직 배치 */
  align-items: flex-start; /* 왼쪽 정렬 */
  margin-left: 10px; /* 텍스트와 이미지 간의 간격 */
}

.service-guide-item .service-guide-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.service-guide-item .service-guide-subtitle {
  font-size: 14px;
  color: #888; /* 연한 폰트 색상 */
}

.service-guide-item .service-guide-img {
  margin-right: 10px; /* 이미지와 텍스트 사이 간격 */
}

.service-guide-item img {
  width: 40px; /* 이미지 크기 설정 */
  height: 40px;
  object-fit: cover;
}

.slider-indicator {
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 14px;
  color: #333;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 5px;
  border-radius: 10px;
}

.slider-header {
  display: flex;
  justify-content: space-between; /* 제목과 "전체보기"를 양 끝 배치 */
  align-items: center;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 20px;
}

.slider-title {
  font-size: 17px;
  font-weight: bold;
}

.view-all-div {
  color: #888;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
}

.slider-content {
  display: flex;
  overflow-x: auto; /* 수평 스크롤 활성화 */
  scrollbar-width: none;
}

.slider-content::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}

.slider-item {
  flex: 0 0 calc(33.33% - 30px); /* 화면 너비의 약 1/3 사용, 간격 고려 */
  max-width: 200px; /* 최대 너비 제한 */
  min-width: 140px; /* 최소 너비 제한 */
  border-radius: 15px;
  padding: 10px;
  text-align: center;
}

.slider-section {
  margin-top: 35px;
}

.slider-section .item-image {
  width: 100%;
  height: 120px;
  border-radius: 10px; /* 둥근 모서리 */
  background-color: #f0f0f0; /* 이미지가 없을 때를 대비한 배경색 */
  display: flex; /* 이미지와 텍스트를 별도로 정렬 가능하게 */
  justify-content: center;
  align-items: center;
  overflow: hidden; /* 둥근 모서리 안에 이미지를 잘라내기 */
}

.slider-section .item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 이미지 비율 유지하며 채우기 */
  object-position: top;
}

.slider-section .item-text {
  margin-top: 10px; /* 이미지 아래에 여백 */
  text-align: center; /* 텍스트를 가운데 정렬 */
}

.slider-section .item-title {
  font-size: 14px;
  font-weight: bold;
  margin-top: 10px;
}

.slider-section .item-company {
  font-size: 13px;
  color: #555;
  margin-top: 5px;
}

.experience-board-section {
  margin-top: 35px;
}

.experience-board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 20px;
}

.experience-board-title {
  font-size: 17px;
  font-weight: bold;
}

.experience-board-view-all {
  color: #888;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
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