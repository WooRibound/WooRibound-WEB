<script>
import {useSubscriptionStore} from "@/stores/useSubscriptionStore";
import {computed} from "vue";

export default {
  name: "PaymentManagementView",
  setup() {
    const subscriptionStore = useSubscriptionStore();
    const isSubscribed = computed(() => subscriptionStore.isSubscribed);

    return {
      isSubscribed,
    };
  }
}
</script>

<template>
  <main class="body">
    <div class="header">결제 관리</div>
    <div class="content">
      <!-- 결제 수단 섹션(결제 x) -->
      <div class="payment-method" v-if="!isSubscribed">
        <div class="section-title">결제 수단</div>
        <div class="method-container">
          <div class="method-item">
            <div class="method-name">결제 수단을 등록해주세요.</div>
          </div>
          <div class="update-method">
            <button class="update-btn">결제 수단 등록하기</button>
          </div>
        </div>
      </div>

      <!-- 결제 수단 섹션(결제 o) -->
      <div class="payment-method" v-if="isSubscribed">
        <div class="section-title">결제 수단</div>
        <div class="method-container">
          <div class="method-item">
            <div class="method-name">네이버페이 (간편결제)</div>
            <div class="method-date">등록일 : 2024년 10월 20일</div>
          </div>
          <div class="update-method">
            <button class="update-btn">등록된 결제 변경</button>
          </div>
        </div>
      </div>

      <!-- 결제 영수증 섹션 -->
      <div class="payment-receipt" v-if="isSubscribed">
        <div class="section-title">결제 영수증</div>
        <div class="receipt-container">
          <div class="receipt-date">2024년 11월 20일</div>
          <div class="receipt-method">네이버페이</div>
          <div class="receipt-id">결제번호 : 121212131353535</div>
          <div class="receipt-id">금액 : 300,000원</div>
        </div>
      </div>

      <!-- 결제 취소 안내 섹션 추가 -->
      <div class="payment-cancel">
        <div class="section-title">결제 취소 안내</div>
        <div class="cancel-message">
          <p>결제 취소는 결제 후 7일 이내에 가능합니다. 취소를 원하시면 고객센터로 문의하시기 바랍니다.</p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.body {
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f8f9fa;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.header {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.payment-method, .payment-receipt, .payment-cancel {
  padding: 20px;
}

.method-container, .receipt-container, .cancel-message {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.receipt-container {
  border-top: 2px solid #ddd;  /* 상단에 보더 추가 */
  border-bottom: 2px solid #ddd; /* 하단에 보더 추가 */
  padding: 10px 0; /* 상하 패딩 추가 */
}

.method-item, .receipt-date, .receipt-method, .receipt-id {
  font-size: 16px;
  color: #555;
}

.method-item {
  background-color: #fff;
  padding: 20px;
  border: 1px solid #686D76;
  border-radius: 8px;
}

.method-name {
  font-weight: bold;
}

.method-date {
  color: #999;
}

.update-method {
  margin-top: 10px;
}

.update-btn {
  padding: 10px 15px;
  background-color: #024CAA;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s;
  width: 100%;
}

.update-btn:hover {
  background-color: #0056b3;
}

.receipt-date {
  font-weight: bold;
}

.receipt-method {
  color: #2980b9;
}

.payment-cancel {
  background-color: #fff7e6; /* 연한 노란색 배경 */
  border-left: 5px solid #f39c12; /* 왼쪽에 강조된 색상 */
}

.cancel-message p {
  font-size: 16px;
  color: #555;
  margin-bottom: 15px;
}

.cancel-btn {
  padding: 10px 15px;
  background-color: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s;
}

.cancel-btn:hover {
  background-color: #0056b3;
}
</style>
