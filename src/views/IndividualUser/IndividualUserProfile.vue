<script>
import { ref, computed } from "vue";
import ModalPopup from "@/components/SingleButtonModal.vue";
import { useRegionsStore } from "@/stores/useRegionsStore";
import {useRouter} from "vue-router";
import {ROUTES} from "@/router/routes";
export default {
  name: "IndividualUserProfile",
  components: { ModalPopup },
  setup() {
    const router = useRouter();
    const  regionsStore = useRegionsStore();

    const selectedProvince = ref('');
    const selectedCity = ref('');

    const provinces = computed(() => regionsStore.getProvinces);
    const allCities = computed(() => regionsStore.getCitiesByProvince(selectedProvince.value));

    const filteredCities = computed(() => {
      return selectedProvince.value ? allCities.value : [];
    });

    const modalPopupStatue = ref(false);

    // 경력 여부와 직종
    const careerStatus = ref("none"); // 'none', 'yes', 'no' 중 선택
    // todo 직종 리스트 받는 api로 값전 달하기
    const jobCategories = ref([
      "개발자", "디자이너", "마케터", "영업", "기획자", "기타"
    ]);

    const isJobCategoryEnabled = computed(() => careerStatus.value === "yes");

    const selectedJobs = ref([""]);
    const selectedInterestJobs = ref([""]);

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

    const onUpdateProfilerClick = () => {
      modalPopupStatue.value = true;
    }

    const onDeleteAccountClick = () => {
      router.push(ROUTES.INDIVIDUAL_USER_DELETE.path);
    }

    return {
      modalPopupStatue,
      selectedProvince,
      selectedCity,
      provinces,
      filteredCities,
      careerStatus,
      jobCategories,
      isJobCategoryEnabled,
      selectedJobs,
      selectedInterestJobs,
      addJobField,
      removeJobField,
      addInterestJobField,
      removeInterestJobField,
      onUpdateProfilerClick,
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
          <input class="input-field" placeholder="이름">
        </div>
        <!-- 휴대폰번호 입력 -->
        <div class="input-label">
          <span class="required">*</span>
          <input class="input-field" placeholder="휴대폰 번호" type="tel">
        </div>
        <!-- 성별 선택 -->
        <div class="input-label">
          <span class="required">*</span>
          <select class="input-field" aria-label="성별 선택">
            <option value="" disabled selected>성별</option>
            <option value="male">남성</option>
            <option value="female">여성</option>
          </select>
        </div>
        <!-- 거주 도 선택 -->
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
            <option v-for="city in filteredCities" :key="city" :value="city">{{ city }}</option>
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
        <div class="delete-button" @click="onUpdateProfilerClick">수정하기</div>
        <div class="delete-button" @click="onDeleteAccountClick">탈퇴하기</div>
      </div>
    </div>
  </main>
  <modal-popup
      v-if="modalPopupStatue"
      @close-modal="modalPopupStatue = false"
      :modal-message="'수정이 완료되었습니다.'"
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

.subtitle {                     /* 소제목 스타일 */
  font-size: 18px;              /* 글자 크기 */
  font-weight: bold;            /* 글자 두께 */
  margin-bottom: 10px;          /* 아래쪽 여백 */
  color: #333;                  /* 텍스트 색상 */
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

.delete-button {
  margin-top: 40px; /* 수정하기 버튼과의 간격을 조정 */
  margin-left: 10px;
  color: #6c757d; /* 회색 텍스트 색상 */
  cursor: pointer; /* 포인터 커서 추가 */
  font-size: 10pt;
  align-self: flex-start; /* 왼쪽 정렬 */
}
</style>