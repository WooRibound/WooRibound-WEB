<script>
import {computed, onMounted, ref} from "vue";
import ModalPopup from "@/components/SingleButtonModal.vue";
import {useRegionsStore} from "@/stores/useRegionsStore";
import {useRouter} from "vue-router";
import {ROUTES} from "@/router/routes";
import {fetchUpdateUserProfile, fetchUserProfile} from "@/api/services/individualUserService";
import {formatDate2, formatPhoneNumber} from "@/utils/formatters";
import {useJobStore} from "@/stores/useJobStore";
import {GENDER_TYPES} from "@/constants/genderTypes";
import TermsPrivacyOfServicePopup from "@/components/TermsPrivacyOfServicePopup.vue";
import {isOnlyLetters, isPhoneNumberValid} from "@/utils/validators";
import {TERMS_PRIVACY_TYPES} from "@/constants/termsPrivacyTypes";

export default {
  name: "IndividualUserProfile",
  computed: {
    GENDER_TYPES() {
      return GENDER_TYPES
    }
  },
  components: {TermsPrivacyOfServicePopup, ModalPopup},
  setup() {
    const router = useRouter();
    const regionsStore = useRegionsStore();
    const jobStore = useJobStore();

    const modalPopupStatue = ref(false);
    const modalMessage = ref("");
    const errorMessage = ref("");
    const phoneError = ref("");
    const termsPrivacyType = ref("");
    const termsPrivacyOfServicePopupStatue = ref(false);
    const jobs = computed(() => jobStore.getJobs);

    const provinces = computed(() => regionsStore.getProvinces);
    const selectedProvince = ref('');
    const cities = computed(() => regionsStore.getCitiesByProvince(selectedProvince.value) || []);

    const exjobChkStatus = ref("N");
    const isJobCategoryEnabled = computed(() => exjobChkStatus.value === "Y");

    const initialUserInfo = ref({
      name: '',
      birth: '',
      phone: '',
      email: '',
      gender: '',
      addrProvince: '',     // 거주도
      addrCity: '',         // 거주시
      exjobChk: '',         // 경력 여부
      interestChk: '',      // 관심 직종 선택 여부
      jobInterest: '',      // 최초 관심 직종 선택 여부
      workHistoryJobs: [],  // 경력 직종 리스트
      interestJobs: [],      // 관심 직종 리스트
      dataSharingConsent: ''
    });

    const userInfo = ref({
      name: '',
      birth: '',
      phone: '',
      email: '',
      gender: '',
      addrProvince: '',     // 거주도
      addrCity: '',         // 거주시
      exjobChk: '',         // 경력 여부
      interestChk: '',      // 관심 직종 선택 여부
      jobInterest: '',      // 최초 관심 직종 선택 여부
      workHistoryJobs: [],  // 경력 직종 리스트
      interestJobs: [],      // 관심 직종 리스트
      dataSharingConsent: ''
    });

    const handlePhoneNumberInput = (event) => {
      const formattedValue = formatPhoneNumber(event.target.value);
      event.target.value = formattedValue;
      userInfo.value.phone = formattedValue;
    };

    const validatePhone = () => {
      phoneError.value = !isPhoneNumberValid(userInfo.value.phone);
    };

    const onAddJobFieldClick = () => {
      if (userInfo.value.workHistoryJobs.length < 3) {
        userInfo.value.workHistoryJobs.push("");
      }
    };

    const onRemoveJobFieldClick = (index) => {
      userInfo.value.workHistoryJobs.splice(index, 1);
    };

    const onAddInterestJobFieldClick = () => {
      if (userInfo.value.interestJobs.length < 3) {
        userInfo.value.interestJobs.push("");
      }
    };

    const onRemoveInterestJobFieldClick = (index) => {
      userInfo.value.interestJobs.splice(index, 1);
    };

    const initializeUserProfile = (response) => {
      userInfo.value = response;

      userInfo.value.birth = formatDate2(userInfo.value.birth);  // 생일 형식 포맷
      selectedProvince.value = userInfo.value.addrProvince;      // 거주시 필터를 위해서 selectedProvince 에 값 할당
      exjobChkStatus.value = userInfo.value.exjobChk;            // 경력 여부 상태 값 할당

      initialUserInfo.value = JSON.parse(JSON.stringify(userInfo.value));

      // workHistoryJobs, interestJobs가 빈 배열일 경우 공백인 값 추가
      if (userInfo.value.workHistoryJobs.length === 0) {
        userInfo.value.workHistoryJobs.push('');
      }
      if (userInfo.value.interestJobs.length === 0) {
        userInfo.value.interestJobs.push('');
      }
    }

    const loadUserProfile = async () => {
      try {
        const response = await fetchUserProfile();
        initializeUserProfile(response);
      } catch (error) {
        console.error("회원 정보를 불러오는 데 실패했습니다 : ", error);
      }
    };

    onMounted(() => {
      loadUserProfile();
    });

    const onUpdateProfileClick = async () => {
      // workHistoryJobs, interestJobs 배열에 공백인 값 삭제
      userInfo.value.workHistoryJobs = userInfo.value.workHistoryJobs.filter(job => job !== '');
      userInfo.value.interestJobs = userInfo.value.interestJobs.filter(job => job !== '');

      const isUserInfoUnchanged = JSON.stringify(initialUserInfo.value) === JSON.stringify(userInfo.value);

      if (isUserInfoUnchanged) {
        // workHistoryJobs, interestJobs 배열에 공백인 값 다시 추가
        if (userInfo.value.workHistoryJobs.length === 0) {
          userInfo.value.workHistoryJobs.push('');
        }
        if (userInfo.value.interestJobs.length === 0) {
          userInfo.value.interestJobs.push('');
        }

        modalMessage.value = "변경사항이 없습니다.";
        modalPopupStatue.value = true;
        return;
      }

      try {
        if (!isOnlyLetters(userInfo.value.name)) {
          errorMessage.value = "이름은 영문자나 한글만 입력해주세요.";
          return;
        }

        if (!userInfo.value.gender ||
            !userInfo.value.addrProvince ||
            !userInfo.value.addrCity ||
            !userInfo.value.exjobChk
        ) {
          errorMessage.value = "모든 필수 항목을 입력해주세요.";
          return;
        }

        const date = new Date(userInfo.value.birth);
        userInfo.value.birth = date.toISOString();
        userInfo.value.exjobChk = exjobChkStatus;

        const response = await fetchUpdateUserProfile(userInfo.value);
        initializeUserProfile(response);

        modalMessage.value = "수정이 완료되었습니다.";
        modalPopupStatue.value = true;

      } catch (error) {
        console.error("사용자 정보를 수정하는 중 오류가 발생했습니다 : ", error);
      }
    };

    const onDeleteAccountClick = () => {
      router.push(ROUTES.INDIVIDUAL_USER_DELETE.path);
    }

    const onTermsClick = () => {
      termsPrivacyType.value = TERMS_PRIVACY_TYPES.TERMS;
      termsPrivacyOfServicePopupStatue.value = true;
    }

    const onPrivacyClick = () => {
      termsPrivacyType.value = TERMS_PRIVACY_TYPES.PRIVACY;
      termsPrivacyOfServicePopupStatue.value = true;
    }

    return {
      modalPopupStatue,
      modalMessage,
      errorMessage,
      phoneError,
      termsPrivacyOfServicePopupStatue,
      termsPrivacyType,
      jobs,
      provinces,
      cities,
      exjobChkStatus,
      isJobCategoryEnabled,
      userInfo,
      handlePhoneNumberInput,
      validatePhone,
      onAddJobFieldClick,
      onRemoveJobFieldClick,
      onAddInterestJobFieldClick,
      onRemoveInterestJobFieldClick,
      onTermsClick,
      onPrivacyClick,
      onUpdateProfileClick,
      onDeleteAccountClick,
    };
  }
}
</script>

<template>
  <main class="body">
    <div class="header">개인 정보</div>
    <div class="subtitle">개인정보 수정</div>
    <div class="content">
      <!-- 이름 입력  -->
      <div class="input-section">
        <div class="input-label">
          <span class="required">*</span>
          <input class="input-field" placeholder="이름" v-model="userInfo.name">
        </div>
        <!-- 생년월일 -->
        <div class="input-label" style="margin-left: 8px;">
          <span class="required"></span>
          <input
              v-model="userInfo.birth"
              class="input-field"
              placeholder="생년월일"
              type="text"
              readonly
          >
        </div>
        <!-- 휴대폰번호 입력 -->
        <div class="input-label">
          <span class="required">*</span>
          <div class="input-wrapper">
            <input
                class="input-field"
                placeholder="휴대폰 번호"
                type="tel"
                v-model="userInfo.phone"
                @input="handlePhoneNumberInput"
                @blur="validatePhone"
            >
            <div v-if="phoneError" class="phone-error-message">휴대폰 형식을 맞춰주세요</div>
        </div>
        </div>
        <!-- 성별 선택 -->
        <div class="input-label">
          <span class="required">*</span>
          <select class="input-field" aria-label="성별 선택" v-model="userInfo.gender">
            <option value="" disabled selected>성별</option>
            <option :value="GENDER_TYPES.M">남성</option>
            <option :value="GENDER_TYPES.F">여성</option>
          </select>
        </div>
        <!-- 거주 도 선택 -->
        <div class="input-label">
          <span class="required">*</span>
          <select v-model="userInfo.addrProvince" class="input-field" aria-label="거주 도">
            <option value="" disabled selected>거주 도</option>
            <option v-for="province in provinces" :key="province" :value="province">{{ province }}</option>
          </select>
        </div>
        <!-- 거주 시 선택 -->
        <div class="input-label">
          <span class="required">*</span>
          <select v-model="userInfo.addrCity" class="input-field" aria-label="거주 시">
            <option value="" disabled selected>거주 시</option>
            <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
          </select>
        </div>
        <!-- 경력 여부 선택 -->
        <div class="input-label" style="padding-top: 10px;">
          <span class="required">*</span>
          <span class="bold-text">경력 여부</span>
          <label><input type="radio" v-model="exjobChkStatus" value="Y"> 있음</label>
          <label><input type="radio" v-model="exjobChkStatus" value="N"> 없음</label>
        </div>
        <!-- 직종 선택 -->
        <div v-if="isJobCategoryEnabled" class="input-label job-category-section">
          <div v-for="(jobId, index) in userInfo.workHistoryJobs" :key="index" class="job-category">
            <div class="select-wrapper">
              <select v-model="userInfo.workHistoryJobs[index]" class="input-field" aria-label="직종 선택">
                <option value="" disabled selected>직종 선택</option>
                <option v-for="job in jobs" :key="job.jobId" :value="job.jobId">{{ job.jobName }}</option>
              </select>
            </div>
            <div class="button-wrapper">
              <div v-if="index === userInfo.workHistoryJobs.length - 1 && userInfo.workHistoryJobs.length < 3"
                   @click="onAddJobFieldClick" class="icon-button add-button">
                <img src="@/assets/images/icons/plus.png" alt="추가">
              </div>
              <div v-if="userInfo.workHistoryJobs.length > 1" @click="onRemoveJobFieldClick(index)"
                   class="icon-button remove-button">
                <img src="@/assets/images/icons/minus.png" alt="제거">
              </div>
            </div>
          </div>
        </div>
        <!-- 관심 직종 선택 -->
        <div class="input-label" style="padding-top: 15px;">
          <span class="not-required">‣</span>
          <span class="bold-text">관심 직종</span>
          <span class="small-text">* 관심 직종 등록 시 우바 고도가 올라갑니다.</span>
        </div>
        <div v-for="(interestJob, index) in userInfo.interestJobs" :key="index" class="job-category">
          <div class="select-wrapper">
            <select v-model="userInfo.interestJobs[index]" class="input-field" aria-label="관심 직종 선택">
              <option value="" disabled selected>관심 직종 선택</option>
              <option v-for="job in jobs" :key="job.jobName" :value="job.jobId">{{ job.jobName }}</option>
            </select>
          </div>
          <div class="button-wrapper">
            <div v-if="index === userInfo.interestJobs.length - 1 && userInfo.interestJobs.length < 3"
                 @click="onAddInterestJobFieldClick" class="icon-button add-button">
              <img src="@/assets/images/icons/plus.png" alt="추가">
            </div>
            <div v-if="index > 0 && index === userInfo.interestJobs.length - 1" @click="onRemoveInterestJobFieldClick(index)"
                 class="icon-button remove-button">
              <img src="@/assets/images/icons/minus.png" alt="제거">
            </div>
          </div>
        </div>
        <div class="consent-wrapper" v-if="userInfo.dataSharingConsent === 'N'">
          <input
              type="checkbox"
              id="thirdPartyConsent"
              v-model="userInfo.dataSharingConsent"
              class="consent-checkbox"
          >
          <div class="consent-content">
            <label  class="consent-label">
              [선택]
              <span @click="onTermsClick" class="clickable-text">이용약관</span>동의 및
              <span @click="onPrivacyClick" class="clickable-text">개인정보</span>제3자 제공 동의
            </label>
          </div>
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
        </div>
        <div class="update-button" @click="onUpdateProfileClick">수정하기</div>
        <div class="delete-button" @click="onDeleteAccountClick">탈퇴하기</div>
      </div>
    </div>
  </main>
  <modal-popup
      v-if="modalPopupStatue"
      @close-modal="modalPopupStatue = false"
      :modal-message="modalMessage"
  />
  <terms-privacy-of-service-popup
      v-if="termsPrivacyOfServicePopupStatue"
      @close-popup="termsPrivacyOfServicePopupStatue = false"
      :type="termsPrivacyType"
  />
</template>

<style scoped>
.body {
  flex: 1; /* 가변 영역, 헤더와 바텀 내비게이션을 제외한 나머지 공간 차지 */
  padding: 20px; /* 내부 여백 */
  box-sizing: border-box; /* 패딩을 포함한 크기 계산 */
  background-color: #f8f9fa; /* 배경색 */
  overflow-y: auto; /* 내용이 넘칠 경우 스크롤 가능 */
}

.header {
  font-size: 24px; /* 헤더 폰트 크기 */
  font-weight: bold; /* 헤더 두껍게 */
  margin-bottom: 20px; /* 아래쪽 여백 */
}

.subtitle { /* 소제목 스타일 */
  font-size: 18px; /* 글자 크기 */
  font-weight: bold; /* 글자 두께 */
  margin-bottom: 10px; /* 아래쪽 여백 */
  color: #333; /* 텍스트 색상 */
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between; /* 콘텐츠와 요소를 공간을 균등하게 분배 */
  height: 100%; /* 전체 높이를 사용하도록 설정 */
}

.input-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  flex: 1; /* 가변적으로 공간을 차지하도록 설정 */
}

.input-label {
  display: flex; /* 수평 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
  width: 100%;
}

.bold-text {
  font-weight: bold; /* 글씨체를 굵게 설정 */
  margin-left: 13px;
}

.small-text {
  font-size: 12px; /* 작은 텍스트의 크기 설정 */
  color: #6c757d; /* 적절한 색상 설정 (예: 회색) */
  margin-left: 15px; /* 왼쪽 여백 추가 (bold-text와 정렬) */
}

input[type="radio"] {
  margin-left: 13px;
}

.input-field {
  width: 100%; /* 너비를 100%로 설정하여 부모 요소의 전체 너비를 차지 */
  padding: 10px;
  margin: 10px 10px;
  box-sizing: border-box;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #e1e1e1;
  color: #413F42;
}

.required {
  color: #F60F0F;
  margin-right: 5px;
}

.not-required {
  margin-right: 5px;
}

.update-button {
  width: 90%;
  padding: 10px;
  margin-top: 35px;
  background-color: #024CAA;
  color: white;
  text-align: center;
  cursor: pointer;
  font-weight: bold;
  border-radius: 8px;
}

.job-category-section {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.job-category {
  display: flex; /* 수평 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
  justify-content: space-between; /* 좌우 간격을 균등하게 */
  margin-top: 10px;
  height: 50px; /* 고정 높이 */
  width: 100%;
  margin-left: 22px;
}

.select-wrapper {
  flex: 1; /* select 필드가 가로 공간을 차지하도록 설정 */
  margin-right: 10px; /* 오른쪽 여백 추가 */
}

.button-wrapper {
  display: flex;
  align-items: center;
  width: 80px;

}

.icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  cursor: pointer;
  margin-left: 5px;
}

.add-button img,
.remove-button img {
  width: 24px;
  height: 24px;
}

.add-button {
  background-color: #e0f7fa;
  border-radius: 50%;
}

.remove-button {
  background-color: #ffebee;
  border-radius: 50%;
}

.delete-button {
  margin: 40px 0 20px 10px;
  color: #6c757d; /* 회색 텍스트 색상 */
  cursor: pointer; /* 포인터 커서 추가 */
  font-size: 10pt;
  align-self: flex-start; /* 왼쪽 정렬 */
}

.input-field[readonly] {
  background-color: #e0e0e0;
  color: #666;
  cursor: not-allowed;
}

.consent-wrapper {
  margin-top: 25px;
  margin-bottom: 10px;
  display: flex;
  align-items: flex-start;
  padding: 0 10px;
}

.consent-checkbox {
  margin-right: 10px;
  margin-top: 3px;
  cursor: pointer;
}

.consent-content {
  flex: 1;
}

.consent-label {
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.consent-label .required {
  margin-right: 5px;
}

.clickable-text {
  color: #133E87; /* 클릭 가능한 텍스트 색상 (예: 파란색) */
  cursor: pointer; /* 마우스를 올리면 손가락 모양으로 변경 */
  margin: 0 5px; /* 텍스트 간격 조정 */
}

.consent-label {
  display: flex; /* 인라인 배치를 위한 플렉스 사용 */
  flex-wrap: wrap; /* 내용이 길어질 경우 줄바꿈 */
  align-items: center; /* 텍스트 세로 정렬 */
  font-size: 14px;
}

.error-message {
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 10px;
  margin: 10px 0;
  width: 90%;
  text-align: center;
  white-space: pre-line;  /* 줄바꿈을 위해 추가 */
}

.input-wrapper {
  position: relative; /* 위치 설정을 위해 relative 추가 */
  display: flex;
  flex-direction: column; /* 에러 메시지를 input 아래에 배치 */
  width: 90%;
}

.phone-error-message {
  color: red;
  font-size: 0.875em; /* 에러 메시지 폰트 크기 */
  margin-top: 4px; /* 위쪽 여백 추가 */
  margin-left: 10px;
}
</style>