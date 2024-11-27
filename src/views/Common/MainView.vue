<script>

import {computed, onMounted, ref, watch} from "vue";
import {fetchRecentJobPostings, fetchRecommendJobPostings} from "@/api/services/individualUserService";
import {ROUTES} from "@/router/routes";
import {useRouter} from "vue-router";
import {useUserStore} from "@/stores/userStore";
import {USER_TYPES} from "@/constants/userTypes";

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
        title: "경력 살려서 채용공고 찾기",
        subtitle: "경력을 살려보는건 어때요?",
        img: require('@/assets/images/icons/career.png'),
        route: ROUTES.JOB_POSTINGS_PAGE.name,
        viewType: 'career',
        backgroundColor: '#F2EED7'
      },
      {
        title: "관심 직종에 맞는 채용공고 찾기",
        subtitle: "새로운 일 찾아보는건 어때요?",
        img: require('@/assets/images/icons/new.png'),
        route: ROUTES.JOB_POSTINGS_PAGE.name,
        viewType: 'new',
        backgroundColor: '#F5EFFF'
      },
      {
        title: "지혜 마당으로 모여라",
        subtitle: "궁금한 직종에 대해 찾아보세요!",
        img: require('@/assets/images/icons/question.png'),
        route: ROUTES.WISDOM_EXPLORE.name,
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
    const recommendJobPostingList = ref();
    const recentJobPostingList = ref();
    const currentSlide = ref(0);

    const fetchJobPosting = async () => {
      try {
        const recommendResponse = await fetchRecommendJobPostings();
        recommendJobPostingList.value = recommendResponse;

        const recentResponse = await fetchRecentJobPostings();
        recentJobPostingList.value = recentResponse;
      } catch (e) {
        console.log(e);
      }
    };

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
      console.log(index, userType.value);
      currentSlide.value = index;

      if (userType.value === USER_TYPES.CORPORATE_MEMBER) {
        router.push({
          name: corporateServiceGuideList.value[index].route,
        });
        return;
      }

      if (individualServiceGuideList.value[index].route === ROUTES.WISDOM_EXPLORE.name) {
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
      router.push({
        name: ROUTES.JOB_POSTING_DETAIL.name,
        params: {
          postId: postId
        },
      })
    };

    onMounted(() => {
      fetchJobPosting();
      startAutoSlide();
    });

    // 서비스 가이드 항목을 클릭하거나 터치하면 자동 슬라이드 멈춤
    watch(currentSlide, () => {
      stopAutoSlide();
      startAutoSlide();
    });

    return {
      individualServiceGuideList,
      corporateServiceGuideList,
      userType,
      recommendJobPostingList,
      recentJobPostingList,
      currentSlide,
      handleSlideTouch,
      onMoveDetailPageClick,
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
        <div class="slider-title">최신 공고 ☀️</div>
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
      <!-- 오늘 가장 인기 많은 공고 -->
      <div class="slider-section">
        <div class="slider-title">오늘 가장 인기 많은 공고 🔥</div>
        <div class="slider-content">
          <div
              class="slider-item"
              v-for="(recommendJobPosting, index) in recommendJobPostingList"
              :key="index"
              @click="onMoveDetailPageClick(recommendJobPosting.jobPostingId)"
          >
            <div class="item-image">
              <img :src="recommendJobPosting.postImg" alt="Job image" />
            </div>
            <div class="item-text">
              <div class="item-company">{{ recommendJobPosting.entName }}</div>
              <div class="item-title">{{ recommendJobPosting.postTitle }}</div>
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
  font-size: 18px;
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

.slider-title {
  font-size: 20px;
  font-weight: bold;
  margin-left: 10px;
  margin-top: 20px;
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
  max-width: 300px; /* 최대 너비 제한 */
  min-width: 200px; /* 최소 너비 제한 */
  border-radius: 15px;
  padding: 10px;
  text-align: center;
}

.slider-section {
  margin-top: 10px;
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
}

.slider-section .item-text {
  margin-top: 10px; /* 이미지 아래에 여백 */
  text-align: center; /* 텍스트를 가운데 정렬 */
}

.slider-section .item-title {
  font-size: 16px;
  font-weight: bold;
  margin-top: 10px;
}

.slider-section .item-company {
  font-size: 14px;
  color: #555;
  margin-top: 5px;
}
</style>