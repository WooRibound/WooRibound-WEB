<script>
import {computed, ref} from "vue";

export default {
  name: "TermsPrivacyOfServicePopup.vue",
  props: {
    type: {
      type: String,
      required: true,
    }
  },
  setup(props, { emit }) {
    // 이용약관 내용
    const termsContent = ref(`
      제 1 조 (목적)
      이 약관은 회원이 회사가 제공하는 모든 서비스의
      이용에 있어 회원과 회사 간의 권리, 의무 및 책
      임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.

      제 2 조 (정의)
      1. "회원"이란 이 약관에 동의하고 서비스를 이용
      하는 자를 말합니다.
      2. "서비스"란 회사가 제공하는 모든 온라인 서비스
      및 부가 서비스를 말합니다.

      제 3 조 (약관의 효력과 변경)
      회사는 필요 시 약관을 개정할 수 있으며, 변경된 약
      관은 공지 또는 통지한 날로부터 효력이 발생합니다.
    `);

    // 개인정보 내용
    const privacyContent = ref(`
      제 1 조 (목적)
      본 개인정보처리방침은 회원의 개인정보를 보호하고
      적절히 관리하기 위해 회사가 수행하는 정책과
      절차를 설명합니다.

      제 2 조 (수집하는 개인정보 항목)
      1. 회원 가입 시: 이름, 이메일, 전화번호
      2. 서비스 이용 시: 접속 IP 정보, 쿠키, 방문 기록

      제 3 조 (개인정보의 이용 목적)
      회원관리, 서비스 제공, 마케팅 및 광고에 활용
    `);

    // 동적으로 내용을 선택
    const content = computed(() => {
      if (props.type === "Terms") {
        return termsContent.value;
      } else if (props.type === "Privacy") {
        return privacyContent.value;
      } else {
        return "제3자 동의";
      }
    });

    const closePopup = () => {
      emit("close-popup", false); // 부모 컴포넌트로 팝업 닫기 이벤트 전달
    };

    return {
      content,
      closePopup,
    };
  },
};
</script>

<template>
  <div class="popup-overlay">
    <div class="popup-content">
      <div class="popup-header">
        <h2>{{ type === "Terms" ? "이용약관" : type === "Privacy" ? "개인정보 처리 방침" : "제3자 동의" }}</h2>
        <button class="close-button" @click="closePopup">X</button>
      </div>
      <div class="popup-body">
        <div v-html="content"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.popup-content {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  width: 80%;
  max-width: 600px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.popup-header h2 {
  font-size: 20px;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.popup-body {
  max-height: 60vh;
  overflow-y: auto;
  font-size: 13px;
  line-height: 1.5;
  white-space: pre-wrap; /* 줄바꿈 유지 */
}
</style>