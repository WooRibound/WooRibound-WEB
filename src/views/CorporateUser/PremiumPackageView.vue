<script>
import {useSubscriptionStore} from "@/stores/useSubscriptionStore";
import SingleButtonModal from "@/components/SingleButtonModal.vue";
import {ref} from "vue";
import {ROUTES} from "@/router/routes";

export default {
  name: "PremiumPackageView",
  components: {SingleButtonModal},
  setup() {
    const subscriptionStore = useSubscriptionStore();
    const singleModalPopupStatue = ref(false);
    const singleButtonModalMessage = ref('');
    const singleButtonModalRoute = ref('');

    const onSubscriptionClick = (subscriptionType) => {
      if (subscriptionStore.isSubscribed) {
        singleButtonModalMessage.value = '이미 구독 중입니다.';
        singleButtonModalRoute.value = ROUTES.PAYMENT_MANAGEMENT.path;
        singleModalPopupStatue.value = true;
        return;
      }

      subscriptionStore.setSubscriptionStatus(true);
      subscriptionStore.setSubscriptionType(subscriptionType);

      if (subscriptionStore.isSubscribed) {
        singleButtonModalMessage.value = '구독 결제가 완료 되었습니다.';
        singleButtonModalRoute.value = ROUTES.PAYMENT_MANAGEMENT.path;
        singleModalPopupStatue.value = true;
      }
    };

    return {
      onSubscriptionClick,
      singleModalPopupStatue,
      singleButtonModalMessage,
      singleButtonModalRoute,
    };
  }
}
</script>

<template>
  <main class="premium-package">
    <div class="premium-header">프리미엄 패키지</div>
    <div class="premium-content">
      <div class="premium-info-container">
        <div class="premium-description">
          모든 기업 서비스를 <br />
          맴버쉽 구독으로 한 번에!
        </div>
        <div class="premium-benefits">
          <div class="benefit-item">✅ 지원자의 기업 추천 내역 열람</div>
          <div class="benefit-item">✅ 공고 무제한 등록/노출</div>
          <div class="benefit-item">✅ 인재풀 검색, 제안 무제한</div>
          <div class="benefit-item">✅ 공고 이미지 디자인 서비스 제공</div>
        </div>
      </div>
      <div class="premium-pricing">
        <div class="pricing-option">
          <div class="pricing-title">1년 이용권 결제 시</div>
          <div class="pricing-details">
            <div class="discount">60%</div>
            <div class="price">월 30만원</div>
            <div class="tax-info">부가세 별도</div>
          </div>
          <div class="pricing-button" @click="onSubscriptionClick('year')">1년 이용권 결제</div>
        </div>
        <div class="pricing-option">
          <div class="pricing-title">월 정기 결제 시</div>
          <div class="pricing-details">
            <div class="discount">50%</div>
            <div class="price">월 50만원</div>
            <div class="tax-info">부가세 별도</div>
          </div>
          <div class="pricing-button" @click="onSubscriptionClick('month')">월 정기 결제</div>
        </div>
      </div>
    </div>
  </main>
  <single-button-modal
      v-if="singleModalPopupStatue"
      @close-modal="singleModalPopupStatue = false"
      :modal-message="singleButtonModalMessage"
      :router-path="singleButtonModalRoute"
  />
</template>

<style scoped>
.premium-package {
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f8f9fa;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.premium-header {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
  color: #333;
}

.premium-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.premium-info-container {
  background: linear-gradient(135deg, #E7F7FB, #C9E6F0); /* 연한 하늘색 그라데이션 */
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
}

.premium-description {
  font-size: 18px;
  font-weight: 700;
  color: #555;
  line-height: 1.5;
  text-align: center;
  margin-bottom: 20px;
}

.premium-benefits {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.benefit-item {
  font-size: 16px;
  color: #333;
  display: flex;
  align-items: center;
}

.premium-pricing {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  justify-content: space-between;
}

.pricing-option {
  flex: 1;
  min-width: 280px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
}

.pricing-title {
  font-size: 18px;
  font-weight: bold;
  color: #444;
}

.pricing-details {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
}

.discount {
  font-size: 24px;
  font-weight: bold;
  color: #e74c3c;
}

.price {
  font-size: 20px;
  font-weight: bold;
  color: #555;
}

.tax-info {
  font-size: 14px;
  color: #999;
}

.pricing-button {
  margin-top: 10px;
  padding: 10px;
  text-align: center;
  border: 1px solid #555;
  color: #555;
  font-size: 16px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.pricing-button:hover {
  color: white;
  background-color: #024CAA;
  border: 1px solid #024CAA;
}
</style>

