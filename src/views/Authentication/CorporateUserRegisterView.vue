<script>
import { ref, computed, nextTick } from 'vue';
import ModalPopup from "@/components/SingleButtonModal.vue";
import { ROUTES } from "@/router/routes";
import { isDuplicateCheck } from "@/api/services/authenticationService";
import {corporateJoin} from "@/api/services/authenticationService";
import {searchAddress} from "@/utils/addressFinder"

export default {
  name: "CorporateRegisterView",
  computed: {
    ROUTES() {
      return ROUTES
    }
  },
  components: { ModalPopup },
  setup() {
    // 기존 상태 변수들...
    const modalPopupStatue = ref(false);
    const duplicateIdMessage = ref("");
    const isDuplicated = ref(true);
    const errorMessage = ref("");
    const isValidRegNum = ref(true);

    // 회원가입 폼 데이터
    const formData = ref({
      entId: "",          // 아이디
      regNum: "",         // 사업자 번호
      entPwd: "",         // 비밀번호
      entPwdConfirm: "",  // 비밀번호 확인
      entName: "",        // 기업명
      entField: "",       // 산업분야
      entSize: "",        // 기업규모
      ceoName: "",        // 대표자명
      revenue: 0,         // 매출액
      entAddr1: "",       // 주소
      entAddr2: ""        // 상세주소
    });

    const industries = ref([
      "제조업", "정보통신", "금융업", "서비스업", "건설업",
      "유통업", "에너지 및 환경", "농업 및 어업", "제약 및 생명과학"
    ]);

    // 매출액 포맷팅
    const formattedRevenue = computed({
      get() {
        return formData.value.revenue ? new Intl.NumberFormat('ko-KR').format(formData.value.revenue) : "";
      },
      set(value) {
        formData.value.revenue = Number(value.replace(/,/g, ''));
      }
    });

    // 사업자번호 형식 검증
    const validateRegNum = () => {
      const pattern = /^[0-9]{3}-[0-9]{2}-[0-9]{5}$/; // 사업자번호 형식: ***-**-*****
      isValidRegNum.value = pattern.test(formData.value.regNum);
    };

    // 사업자번호 포맷팅
    const formatRegNum = () => {
      const rawValue = formData.value.regNum.replace(/[^0-9]/g, ""); // 숫자만 추출
      if (rawValue.length <= 3) {
        formData.value.regNum = rawValue; // 앞부분만 유지
      } else if (rawValue.length <= 5) {
        formData.value.regNum = `${rawValue.slice(0, 3)}-${rawValue.slice(3)}`; // 3자리 뒤에 `-`
      } else {
        formData.value.regNum = `${rawValue.slice(0, 3)}-${rawValue.slice(3, 5)}-${rawValue.slice(5, 10)}`; // 최종 포맷
      }
    };



    const formatRevenue = (event) => {
      const input = event.target.value;
      const sanitizedInput = input.replace(/[^0-9,]/g, '');
      formattedRevenue.value = sanitizedInput;
    };

    const onAddressSearchClick = async () => {
      try {
        const result = await searchAddress();
        if (result) {

          formData.value.entAddr1 = result.address;

          // 상세주소 입력란으로 포커스 이동
          nextTick(() => {
            const detailInput = document.querySelector('input[placeholder="상세 주소"]');
            if (detailInput) detailInput.focus();
            const len = detailInput.value.length;
            detailInput.setSelectionRange(len, len);
          });
        }
      } catch (error) {
        console.error('주소 검색 중 오류 발생:', error);
      }
    };

    // 유효성 검사
    const validateForm = () => {
      if (!formData.value.entId) {
        errorMessage.value = "아이디를 입력해주세요.";
        return false;
      }
      if (isDuplicated.value) {
        errorMessage.value = "아이디 중복확인을 해주세요.";
        return false;
      }
      if (!formData.value.entPwd) {
        errorMessage.value = "비밀번호를 입력해주세요.";
        return false;
      }
      if (formData.value.entPwd !== formData.value.entPwdConfirm) {
        errorMessage.value = "비밀번호가 일치하지 않습니다.";
        return false;
      }
      if (!formData.value.ceoName) {
        errorMessage.value = "대표자명을 입력해주세요.";
        return false;
      }
      if (!formData.value.entName) {
        errorMessage.value = "기업명을 입력해주세요.";
        return false;
      }
      if (!formData.value.regNum) {
        errorMessage.value = "사업자번호를 입력해주세요.";
        return false;
      }
      if (!isValidRegNum.value) {
        errorMessage.value = "사업자번호 형식이 올바르지 않습니다.";
        return false;
      }
      if (!formData.value.entAddr1) {
        errorMessage.value = "주소를 입력해주세요.";
        return false;
      }
      if (!formData.value.entAddr2) {
        errorMessage.value = "상세주소를 입력해주세요.";
        return false;
      }
      if (!formData.value.entSize) {
        errorMessage.value = "기업규모를 선택해주세요.";
        return false;
      }
      if (!formData.value.entField) {
        errorMessage.value = "산업분야를 선택해주세요.";
        return false;
      }
      if (!formData.value.revenue) {
        errorMessage.value = "매출액을 입력해주세요.";
        return false;
      }
      return true;
    };

    // 회원가입 제출
    const onRegisterClick = async () => {
      if (!validateForm()) return;

      try {
        const registerData = {
          entId: formData.value.entId,
          regNum: formData.value.regNum,
          entPwd: formData.value.entPwd,
          entName: formData.value.entName,
          entField: formData.value.entField,
          entSize: formData.value.entSize,
          ceoName: formData.value.ceoName,
          revenue: formData.value.revenue,
          entAddr1: formData.value.entAddr1,
          entAddr2: formData.value.entAddr2
        };

        await corporateJoin(registerData);
        modalPopupStatue.value = true;
      } catch (error) {
        console.error('회원가입 실패:', error);
        alert('회원가입 중 오류가 발생했습니다.');
      }
    };

    // 중복 확인 함수
    const onCheckDuplicateIdClick = async () => {
      if (!formData.value.entId) {
        alert("아이디를 입력해주세요.");
        return;
      }

      try {
        const response = await isDuplicateCheck(formData.value.entId);
        if (response.isDuplicate) {
          duplicateIdMessage.value = response.message;
          isDuplicated.value = true;
        } else {
          duplicateIdMessage.value = response.message;
          isDuplicated.value = false;
        }
      } catch (error) {
        console.error('중복 확인 중 오류 발생:', error);
        duplicateIdMessage.value = "중복 확인 중 오류가 발생했습니다.";
        isDuplicated.value = true;
      }
    };

    return {
      modalPopupStatue,
      industries,
      formData,
      formattedRevenue,
      duplicateIdMessage,
      isDuplicated,
      errorMessage,
      formatRevenue,
      onAddressSearchClick,
      onRegisterClick,
      onCheckDuplicateIdClick,
      isValidRegNum,
      validateRegNum,
      validateForm,
      formatRegNum
    };
  }
};
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
              v-model="formData.entId"
          />
          <button class="image-register-button" @click="onCheckDuplicateIdClick">중복확인</button>
        </div>
        <!-- 중복 확인 메시지 출력 -->
        <div class="input-label" style="margin-left: 30px; font-size: 10pt">
          <span :class="{ 'error-message': isDuplicated, 'success-message': !isDuplicated && duplicateIdMessage }">
            {{ duplicateIdMessage }}
          </span>
        </div>

        <!-- 비밀번호 입력 -->
        <div class="input-label">
          <span class="required">*</span>
          <input
              class="input-field"
              placeholder="비밀번호"
              type="password"
              v-model="formData.entPwd"
          >
        </div>

        <!-- 비밀번호 재입력 -->
        <div class="input-label">
          <span class="required">*</span>
          <input
              class="input-field"
              placeholder="비밀번호 재입력"
              type="password"
              v-model="formData.entPwdConfirm"
          >
        </div>

        <!-- 대표자명 입력 -->
        <div class="input-label">
          <span class="required">*</span>
          <input
              class="input-field"
              placeholder="대표자명"
              v-model="formData.ceoName"
          >
        </div>

        <!-- 기업명 입력 -->
        <div class="input-label">
          <span class="required">*</span>
          <input
              class="input-field"
              placeholder="기업명"
              v-model="formData.entName"
          >
        </div>

        <!-- 사업자번호 입력 -->
        <div class="input-label">
          <span class="required">*</span>
          <input
              class="input-field"
              placeholder="사업자 번호"
              v-model="formData.regNum"
              @input="formatRegNum"
          />
        </div>


        <!-- 주소 입력 -->
        <div class="input-label">
          <span class="required">*</span>
          <input
              class="input-field"
              placeholder="주소"
              v-model="formData.entAddr1"
          />
          <button class="image-register-button" @click="onAddressSearchClick">검색</button>
        </div>

        <!-- 상세주소 입력 -->
        <div class="input-label">
          <span class="required">*</span>
          <input
              class="input-field"
              placeholder="상세 주소"
              style="margin-left: 7px"
              v-model="formData.entAddr2"
          >
        </div>

        <!-- 기업 규모 선택 -->
        <div class="input-label">
          <span class="required">*</span>
          <select
              class="input-field"
              aria-label="기업 규모"
              v-model="formData.entSize"
          >
            <option value="" disabled selected>기업 규모</option>
            <option value="STARTUP">스타트업</option>
            <option value="SMALL">중소기업</option>
            <option value="MEDIUM">중견기업</option>
            <option value="LARGE">대기업</option>
          </select>
        </div>

        <!-- 산업 선택 -->
        <div class="input-label">
          <span class="required">*</span>
          <select
              class="input-field"
              aria-label="산업"
              v-model="formData.entField"
          >
            <option value="" disabled selected>산업</option>
            <option v-for="industry in industries" :key="industry" :value="industry">
              {{ industry }}
            </option>
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
        <div v-if="errorMessage" class="error-message-container">
          {{ errorMessage }}
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

.error-message-container {
  width: 90%;
  padding: 10px;
  margin-top: 10px;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  color: #dc3545;
  text-align: center;
}

.success-message {
  color: #133E87;
}
.error-message {
  color: #dc3545;  /* 빨간색 */
}
</style>
