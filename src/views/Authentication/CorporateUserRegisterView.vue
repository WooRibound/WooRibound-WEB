<script>
import { ref, computed } from 'vue';
import ModalPopup from "@/components/SingleButtonModal.vue";
import {ROUTES} from "@/router/routes";

export default {
  name: "CorporateRegisterView",
  computed: {
    ROUTES() {
      return ROUTES
    }
  },
  components: {ModalPopup},
  setup() {
    const modalPopupStatue = ref(false);
    const idInput = ref(""); // 아이디 입력 값
    const duplicateIdMessage = ref(""); // 중복 확인 메시지

    const industries = ref([
      "제조업", "정보통신", "금융업", "서비스업", "건설업",
      "유통업", "에너지 및 환경", "농업 및 어업", "제약 및 생명과학"
    ]);

    const revenue = ref(""); // 원본 숫자 값

    const formattedRevenue = computed({
      get() {
        return revenue.value ? new Intl.NumberFormat('ko-KR').format(revenue.value) : "";
      },
      set(value) {
        // 콤마를 제거한 후 숫자로 변환하여 원본 값에 저장
        revenue.value = value.replace(/,/g, '');
      }
    });

    const formatRevenue = (event) => {
      const input = event.target.value;
      // 숫자와 콤마만 허용
      const sanitizedInput = input.replace(/[^0-9,]/g, ''); // 숫자와 콤마를 제외한 모든 문자 제거
      formattedRevenue.value = sanitizedInput; // computed setter가 호출되어 포맷 적용
    };

    const onAddressSearchClick = () => {
      // todo 다음 주소 api로 로직 주소 찾기 로직 구현하기
      console.log("주소찾기");
    }
    const onRegisterClick = () => {
      modalPopupStatue.value = true;
    }

    // 중복 확인 함수
    const onCheckDuplicateIdClick = () => {
      // todo [아이디 중복 확인 API] 구현 시 아래 로직 구현하기
      const existingIds = ["user1", "user2"]; // 하드코딩된 기존 아이디 예시
      if (!idInput.value) {
        alert("아이디를 입력해주세요.");
        return;
      }

      if (existingIds.includes(idInput.value)) {
        duplicateIdMessage.value = "* 해당 아이디는 중복입니다.";
      } else {
        duplicateIdMessage.value = "* 사용 가능한 아이디입니다.";
      }
    }

    return {
      modalPopupStatue,
      industries,
      formattedRevenue,
      idInput,
      duplicateIdMessage,
      formatRevenue,
      onAddressSearchClick,
      onRegisterClick,
      onCheckDuplicateIdClick,
    };
  }
}
</script>

<template>
  <main class="body">
    <div class="header">회원 가입</div>
    <div class="content">
      <div class="input-section">
        <!-- 아이디 입력 -->
        <div class="input-label">
          <span class="required">*</span>
          <input
            class="input-field"
            placeholder="아이디"
            v-model="idInput"
          />
          <button class="image-register-button" @click="onCheckDuplicateIdClick">중복확인</button>
        </div>
        <!-- 중복 확인 메시지 출력 -->
        <div class="input-label" style="margin-left: 30px; font-size: 10pt">
          <span :class="{ 'error-message': duplicateIdMessage.includes('중복입니다'), 'success-message': duplicateIdMessage.includes('사용 가능한') }">
            {{ duplicateIdMessage }}
          </span>
        </div>
        <!-- 비밀번호 입력 -->
        <div class="input-label">
          <span class="required">*</span>
          <input class="input-field" placeholder="비밀번호" type="password">
        </div>
        <!-- 비밀번호 재입력 -->
        <div class="input-label">
          <span class="required">*</span>
          <input class="input-field" placeholder="비밀번호 재입력" type="password">
        </div>
        <!-- 대표자명 입력 -->
        <div class="input-label">
          <span class="required">*</span>
          <input class="input-field" placeholder="대표자명">
        </div>
        <!-- 기업명 입력 -->
        <div class="input-label">
          <span class="required">*</span>
          <input class="input-field" placeholder="기업명">
        </div>
        <!-- 사업자번호 입력 -->
        <div class="input-label">
          <span class="required">*</span>
          <input class="input-field" placeholder="사업자 번호">
        </div>
        <!-- 주소 입력 -->
        <div class="input-label">
          <span class="required">*</span>
          <input class="input-field" placeholder="주소" />
          <button class="image-register-button" @click="onAddressSearchClick">검색</button>
        </div>
        <!-- 상세주소 입력 -->
        <div class="input-label">
          <span class="required"></span>
          <input class="input-field" placeholder="상세 주소" style="margin-left: 7px">
        </div>
        <!-- 성별 선택 -->
        <div class="input-label">
          <span class="required">*</span>
          <select class="input-field" aria-label="기업 규모">
            <option value="" disabled selected>기업 규모</option>
            <option value="large">대기업</option>
            <option value="medium">중견기업</option>
            <option value="small">중소기업</option>
            <option value="startup">스타트업</option>
          </select>
        </div>
        <!-- 산업 선택 -->
        <div class="input-label">
          <span class="required">*</span>
          <select class="input-field" aria-label="산업">
            <option value="" disabled selected>산업</option>
            <option v-for="industry in industries" :key="industry" :value="industry">{{ industry }}</option>
          </select>
        </div>
        <!-- 매출액 입력 -->
        <div class="input-label">
          <span class="required">*</span>
          <input
              class="input-field"
              placeholder="매출액"
              type="text"
              v-model="formattedRevenue"
              @input="formatRevenue"
              @keydown="formatRevenue"
              @keyup="formatRevenue"
          />
        </div>
        <div class="delete-button" @click="onRegisterClick">회원가입</div>
      </div>
    </div>
  </main>
  <modal-popup
      v-if="modalPopupStatue"
      @close-modal="modalPopupStatue = false"
      :modal-message="'회원가입이 완료되었습니다.'"
      :router-path="ROUTES.MAIN.path"
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

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.input-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  flex: 1;
}

.input-label {
  display: flex;
  align-items: center;
  width: 100%;
}

.required {
  color: #F60F0F;
  margin-right: 5px;
}

.input-field {
  width: 100%;
  padding: 10px;
  margin: 10px 10px 10px 0; /* 오른쪽 여백 추가 */
  box-sizing: border-box;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #e1e1e1;
  color: #413F42;
}

.image-register-button {
  padding: 0 15px; /* 상하 패딩을 0으로 설정 */
  background-color: #024CAA; /* 버튼 배경색 */
  color: white; /* 글자색 */
  border: none; /* 테두리 없앰 */
  border-radius: 8px; /* 버튼 모서리 둥글게 */
  cursor: pointer; /* 커서 포인터로 변경 */
  margin-left: 10px; /* 아이디 입력 필드와 버튼 간격 */
  font-size: 14px; /* 글자 크기 */
  height: 40px; /* 버튼 높이를 아이디 입력 필드와 동일하게 설정 */
  white-space: nowrap; /* 텍스트가 줄 바꿈되지 않도록 설정 */
}

.image-register-button:hover {
  background-color: #023c7a; /* 버튼 호버 시 배경색 변경 */
}

.delete-button {
  width: 90%;
  padding: 10px;
  margin-top: 20px;
  background-color: #024CAA;
  color: white;
  text-align: center;
  cursor: pointer;
  font-weight: bold;
  border-radius: 8px;
}

.error-message {
  color: #C62E2E;
}

.success-message {
  color: #133E87;
}
</style>
