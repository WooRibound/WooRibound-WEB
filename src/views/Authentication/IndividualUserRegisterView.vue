<script>
import { ref, computed, onMounted } from "vue";
import ModalPopup from "@/components/SingleButtonModal.vue";
import { useRegionsStore } from "@/stores/useRegionsStore";
import { ROUTES } from "@/router/routes";
import { useUserStore } from "@/stores/userStore";
import { decodeToken } from "@/utils/tokenDecoder";
import { fetchJoinInfo } from "@/api/services/individualUserService";

export default {
  name: "IndividualUserRegisterView",
  computed: {
    ROUTES() {
      return ROUTES;
    }
  },
  components: { ModalPopup },
  setup() {
    const regionsStore = useRegionsStore();

    // 사용자 정보를 저장할 반응형 변수들

    const userName = ref("");
    const userEmail = ref("");
    const userPhone = ref("");
    const userGender = ref("");
    const userBirth = ref("");
    const selectedProvince = ref("");
    const selectedCity = ref("");  // 추가된 부분
    const modalPopupStatue = ref(false);

    // 경력 여부와 직종
    const careerStatus = ref("none");
    const jobCategories = ref(["기획-전략", "마케팅-홍보·조사", "회계-세무·재무", "인사-노무·HRD", "총무-법무·사무",
      "IT개발-데이터", "디자인", "영업-판매-무역", "고객상담-TM", "구매-자재-물류",
      "상품기획-MD", "운전-운송-배송", "서비스", "생산", "건설-건축", "의료", "연구-R&D",
      "교육", "미디어-문화-스포츠", "금융-보험", "공공-복지",
    ]);

    const isJobCategoryEnabled = computed(() => careerStatus.value === "yes");
    const selectedJobs = ref([""]);
    const selectedInterestJobs = ref([""]);

    // cities는 computed로 처리하여 선택된 도에 따라 동적으로 도시 리스트를 가져옵니다.
    const cities = computed(() => {
      return regionsStore.getCitiesByProvince(selectedProvince.value) || [];
    });

    // 사용자 정보를 가져오는 함수
    const fetchUserInfo = async () => {
      try {
        const userInfo = await fetchJoinInfo();

        if (userInfo) {
          // 받아온 데이터로 폼 필드 업데이트
          userName.value = userInfo.name || "";
          userPhone.value = userInfo.phone || "";
          userGender.value = userInfo.gender?.toLowerCase() || "";
          userEmail.value = userInfo.email || "";
          if (userInfo.gender === 'M') {
            userGender.value = 'male';
          } else if (userInfo.gender === 'F') {
            userGender.value = 'female';
          } else {
            userGender.value = '';
          }
          if (userInfo.birth) {
            const birthDate = new Date(userInfo.birth);
            userBirth.value = birthDate.toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            }).replace(/. /g, '-').replace('.', '');
          }
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        // 에러 처리 (예: 토스트 메시지 표시 등)
      }
    };

    // 컴포넌트 마운트 시 사용자 정보 가져오기
    onMounted(() => {
      fetchUserInfo();
    });

    const addJobField = () => {
      if (selectedJobs.value.length < 3) {
        selectedJobs.value.push("");
      }
    };

    const removeJobField = (index) => {
      selectedJobs.value.splice(index, 1);
    };

    const addInterestJobField = () => {
      if (selectedInterestJobs.value.length < 3) {
        selectedInterestJobs.value.push("");
      }
    };

    const removeInterestJobField = (index) => {
      selectedInterestJobs.value.splice(index, 1);
    };

    const onRegisterClick = () => {
      modalPopupStatue.value = true;
    }

    return {
      modalPopupStatue,
      userName,
      userEmail,
      userPhone,
      userGender,
      userBirth,
      provinces: computed(() => regionsStore.getProvinces),
      selectedProvince,
      selectedCity,  // 추가된 부분
      cities,
      careerStatus,
      jobCategories,
      isJobCategoryEnabled,
      selectedJobs,
      selectedInterestJobs,
      addJobField,
      removeJobField,
      addInterestJobField,
      removeInterestJobField,
      onRegisterClick,
    };
  },
  mounted() {
    console.log('IndividualUserRegisterView mounted');
    this.storeAccessToken();
  },
  methods: {
    storeAccessToken() {
      const accessToken = this.getAccessTokenFromHash();
      console.log('Got access token from query:', accessToken);

      if (accessToken) {
        const tokenWithBearer = `Bearer ${accessToken}`;
        localStorage.setItem("accessToken", tokenWithBearer);
        console.log('Stored token in localStorage:', tokenWithBearer);

        const store = useUserStore();
        console.log('Initial store state:', store.$state);

        const success = decodeToken();
        console.log('Decode token result:', success);

        if (success) {
          console.log('Updated store state:', store.$state);
          console.log('Successfully decoded token and set user info');
          window.history.replaceState({}, document.title, window.location.pathname);
        } else {
          console.error('Failed to decode token and set user info');
        }
      }
    },
    getAccessTokenFromHash() {
      const hash = window.location.hash;
      if (hash.includes('accessToken=')) {
        return hash.split('accessToken=')[1];
      }
      return null;
    },
  }
}
</script>

<template>
  <main class="body">
    <div class="header">회원가입</div>
    <div class="content">
      <div class="input-section">
        <!-- 이름 입력  -->
        <div class="input-label">
          <span class="required">*</span>
          <input
              v-model="userName"
              class="input-field"
              placeholder="이름"
              :class="{ 'filled': userName }"
          >
        </div>
        <!-- 이메일 입력 -->
        <div class="input-label">
          <span class="required">*</span>
          <input
              v-model="userEmail"
              class="input-field"
              placeholder="이메일"
              type="email"
              :class="{ 'filled': userEmail }"
          >
        </div>
        <!-- 휴대폰번호 입력 -->
        <div class="input-label">
          <span class="required">*</span>
          <input
              v-model="userPhone"
              class="input-field"
              placeholder="휴대폰 번호"
              type="tel"
              :class="{ 'filled': userPhone }"
          >
        </div>
        <!-- 성별 선택 -->
        <div class="input-label">
          <span class="required">*</span>
          <select
              v-model="userGender"
              class="input-field"
              aria-label="성별 선택"
              :class="{ 'filled': userGender }"
          >
            <option value="" disabled selected>성별</option>
            <option value="male">남성</option>
            <option value="female">여성</option>
          </select>
        </div>
        <!-- 생년월일 입력 -->
        <div class="input-label">
          <span class="required">*</span>
          <input
              v-model="userBirth"
              class="input-field"
              type="date"
              data-placeholder="생년월일"
              required
              :class="{ 'filled': userBirth }"
          />
        </div>
        <div class="input-label">
          <span class="required">*</span>
          <select v-model="selectedProvince" class="input-field" aria-label="거주 도">
            <option value="" disabled selected>거주 도</option>
            <option v-for="province in provinces" :key="province" :value="province">{{ province }}</option>
          </select>
        </div>
        <!-- 거주 시 선택 -->
        <div class="input-label">
          <span class="required">*</span>
          <select class="input-field" aria-label="거주 시">
            <option value="" disabled selected>거주 시</option>
            <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
          </select>
        </div>
        <!-- 경력 여부 선택 -->
        <div class="input-label" style="padding-top: 10px;">
          <span class="required">*</span>
          <span class="bold-text">경력 여부</span>
          <label><input type="radio" v-model="careerStatus" value="yes"> 있음</label>
          <label><input type="radio" v-model="careerStatus" value="no"> 없음</label>
        </div>
        <!-- 직종 선택 -->
        <div v-if="isJobCategoryEnabled" class="input-label job-category-section" >
          <div v-for="(job, index) in selectedJobs" :key="index" class="job-category">
            <div class="select-wrapper">
              <select v-model="selectedJobs[index]" class="input-field" aria-label="직종 선택">
                <option value="" disabled selected>직종 선택</option>
                <option v-for="job in jobCategories" :key="job" :value="job">{{ job }}</option>
              </select>
            </div>
            <div class="button-wrapper">
              <div v-if="index === selectedJobs.length - 1 && selectedJobs.length < 3" @click="addJobField" class="icon-button add-button">
                <img src="@/assets/images/icons/plus.png" alt="추가">
              </div>
              <div v-if="index > 0 && index === selectedJobs.length - 1" @click="removeJobField(index)" class="icon-button remove-button">
                <img src="@/assets/images/icons/minus.png" alt="제거">
              </div>
            </div>
          </div>
        </div>
        <!-- 관심 직종 선택 -->
        <div class="input-label" style="padding-top: 15px;">
          <span class="bold-text" style="margin-left: 25px">관심 직종</span>
          <span class="small-text">* 관심 직종 등록 시 우바 고도가 올라갑니다.</span>
        </div>
        <div v-for="(interestJob, index) in selectedInterestJobs" :key="index" class="job-category">
          <div class="select-wrapper">
            <select v-model="selectedInterestJobs[index]" class="input-field" aria-label="관심 직종 선택">
              <option value="" disabled selected>관심 직종 선택</option>
              <option v-for="job in jobCategories" :key="job" :value="job">{{ job }}</option>
            </select>
          </div>
          <div class="button-wrapper">
            <div v-if="index === selectedInterestJobs.length - 1 && selectedInterestJobs.length < 3" @click="addInterestJobField" class="icon-button add-button">
              <img src="@/assets/images/icons/plus.png" alt="추가">
            </div>
            <div v-if="index > 0 && index === selectedInterestJobs.length - 1" @click="removeInterestJobField(index)" class="icon-button remove-button">
              <img src="@/assets/images/icons/minus.png" alt="제거">
            </div>
          </div>
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
  flex: 1;                      /* 가변 영역, 헤더와 바텀 내비게이션을 제외한 나머지 공간 차지 */
  padding: 20px;                /* 내부 여백 */
  box-sizing: border-box;       /* 패딩을 포함한 크기 계산 */
  background-color: #f8f9fa;    /* 배경색 */
  overflow-y: auto;             /* 내용이 넘칠 경우 스크롤 가능 */
}

.header {
  font-size: 24px;              /* 헤더 폰트 크기 */
  font-weight: bold;            /* 헤더 두껍게 */
  margin-bottom: 20px;          /* 아래쪽 여백 */
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
  color: #F60F0F; /* 필수 입력 사항 색상 */
  margin-right: 5px; /* 입력 필드와의 간격 */
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

input[type="date"] {
  position: relative;
  padding-right: 10px;
  background: url("@/assets/images/icons/calender.png") no-repeat right 10px center / 25px auto, #fff;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  color: transparent;
  cursor: pointer;
}
input[type="date"]::before {
  content: attr(data-placeholder);
  width: 100%;
}
input[type="date"]:valid::before {
  display: none;
}
</style>
