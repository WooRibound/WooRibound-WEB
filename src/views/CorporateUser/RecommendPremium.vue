<script>
import {useRoute, useRouter} from "vue-router";
import {fetchRecommendPremium} from "@/api/services/corporateUserService";
import {computed, onMounted, ref} from "vue";
import {useSubscriptionStore} from "@/stores/useSubscriptionStore";
import {ROUTES} from "@/router/routes";

export default {
  name: "RecommendPremiumPage",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const subscriptionStore = useSubscriptionStore();

    const userId = route.params.userId;
    const isSubscription = computed(() => subscriptionStore.subscriptionStatus === '구독 중');
    const recommendedCompanyList = ref([]);

    const fetchRecommendPremiumList = async (userId) => {
      try {
        const response = await fetchRecommendPremium(userId);
        recommendedCompanyList.value = response.map((item) => ({
          entName: item.entName,
        }));
      } catch (error) {
        console.error("[fetchApplicantsList] Error:", error);
      }
    };

    const onPremiumPackageJoinClick = () => {
      router.push({
        name: ROUTES.PREMIUM_PACKAGE.name,
      });
    }

    onMounted(() => {
      fetchRecommendPremiumList(userId);
    });

    return {
      userId,
      recommendedCompanyList,
      isSubscription,
      onPremiumPackageJoinClick,
    };
  }
}
</script>

<template>
  <main class="body">
    <div class="header">추천 지표</div>
    <div class="content-wrapper">
      <div v-if="isSubscription" class="company-list">
        <div
            class="company-item"
            v-for="(recommendedCompany, index) in recommendedCompanyList"
            :key="index"
        >
          <div class="company-text">{{ recommendedCompany.entName }}사에서 추천 받았습니다.</div>
        </div>
      </div>
      <div v-if="!isSubscription" class="company-list">
        <div class="company-item">
          <div class="company-text">***사에서 추천 받았습니다.</div>
        </div>
      </div>
      <div class="overlay" v-if="!isSubscription">
        <div class="premium-btn" @click="onPremiumPackageJoinClick">프리미엄 패키지 가입하기</div>
      </div>
    </div>
  </main>
</template>


<style scoped>
.body {
  display: flex;                /* 플렉스 레이아웃 */
  flex-direction: column;       /* 세로 방향 정렬 */
  height: 100vh;                /* 화면 전체 높이 */
  padding: 0;                   /* 내부 여백 제거 */
  margin: 0;                    /* 외부 여백 제거 */
  background-color: #f8f9fa;    /* 배경색 */
}

.header {
  flex-shrink: 0;               /* 헤더는 크기가 줄지 않도록 고정 */
  font-size: 24px;              /* 폰트 크기 */
  font-weight: bold;            /* 폰트 굵기 */
  padding: 20px;                /* 내부 여백 */
  z-index: 2;                   /* 헤더가 최상단에 표시되도록 */
}

.content-wrapper {
  flex: 1;                      /* 헤더를 제외한 나머지 높이 차지 */
  display: flex;                /* 플렉스 레이아웃 */
  flex-direction: column;       /* 세로 방향 정렬 */
  position: relative;           /* overlay 배치를 위한 상대 위치 */
  overflow-y: auto;             /* 스크롤 가능 */
}

.company-list {
  display: flex;                /* 플렉스 레이아웃 */
  flex-direction: column;       /* 세로 정렬 */
  gap: 15px;                    /* 아이템 간격 */
  padding: 20px;                /* 내부 여백 */
  box-sizing: border-box;       /* 패딩 포함 크기 계산 */
  z-index: 1;                   /* overlay 아래 배치 */
}

.company-item {
  background-color: #ffffff;    /* 카드 배경색 */
  border: 1px solid #dee2e6;    /* 카드 테두리 */
  border-radius: 8px;           /* 카드 모서리 둥글게 */
  padding: 15px;                /* 내부 여백 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
  margin-bottom: 3px;
}

.company-text {
  font-size: 16px;              /* 텍스트 크기 */
  font-weight: 500;             /* 텍스트 굵기 */
  color: #495057;               /* 텍스트 색상 */
  line-height: 1.5;             /* 줄 간격 */
}

.overlay {
  position: absolute;           /* 절대 위치 */
  inset: 0;                     /* top, left, right, bottom을 간단히 설정 */
  margin: 0 10px 5px;           /* 간결하게 마진 설정 */
  background-color: rgba(0, 0, 0, 0.5); /* 반투명 검은 배경 */
  backdrop-filter: blur(3px);   /* 블러 효과 */
  border-radius: 8px;           /* 둥근 모서리 */
  z-index: 2;                   /* 다른 요소 위에 표시 */
  display: flex; /* 버튼을 수평/수직 중앙 배치 */
  justify-content: center; /* 가로 중앙 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
}

.premium-btn {
  background-color: #024CAA;
  color: #fff;
  font-size: 16px;          /* 텍스트 크기 */
  font-weight: bold;        /* 텍스트 굵기 */
  padding: 12px 24px;       /* 버튼 안쪽 여백 */
  border: none;             /* 테두리 제거 */
  border-radius: 8px;       /* 둥근 모서리 */
  cursor: pointer;          /* 커서 모양 변경 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* 그림자 효과 */
  transition: background-color 0.3s ease; /* 배경색 전환 효과 */
}
</style>
