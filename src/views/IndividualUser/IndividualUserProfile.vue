<script>
import {ref, computed, onMounted} from "vue";
import ModalPopup from "@/components/SingleButtonModal.vue";
import { useRegionsStore } from "@/stores/useRegionsStore";
import {useRouter} from "vue-router";
import {ROUTES} from "@/router/routes";
import {fetchUpdateUserProfile, fetchUserProfile} from "@/api/services/individualUserService";
import {fetchJobs} from "@/api/services/globalServiece";
export default {
  name: "IndividualUserProfile",
  components: { ModalPopup },
  setup() {
    const router = useRouter();
    const regionsStore = useRegionsStore();

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
    const jobCategories = ref([]);


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

    const onUpdateProfileClick = async () => {
      try {
        const payload = {
          userId: "",
          name: name.value,
          phone: phone.value,
          gender: gender.value === "male" ? "M" : "F",
          addrCity: selectedCity.value,
          addrProvince: selectedProvince.value,
          exjobChk: careerStatus.value === "yes" ? "Y" : "N",
          workHistoryJobs: selectedJobs.value.filter((job) => job), // 빈 값 제거
          interestJobs: selectedInterestJobs.value.filter((job) => job), // 빈 값 제거
        };

        // API 호출
        const response = await fetchUpdateUserProfile(payload);

        // 성공 처리
        modalPopupStatue.value = true; // 성공 팝업 표시
        console.log("Update successful:", response.data);
      } catch (error) {
        // 에러 처리
        console.error("Update failed:", error);
        errorMessage.value = "사용자 정보를 수정하는 중 오류가 발생했습니다.";
      }
    };

    const onDeleteAccountClick = () => {
      router.push(ROUTES.INDIVIDUAL_USER_DELETE.path);
    }

    const isLoading = ref(false); // 로딩 상태
    const errorMessage = ref(""); // 에러 메시지

    // 필요한 데이터만 정의
    const name = ref("");
    const phone = ref("");
    const gender = ref("");
    const addrProvince = ref("");
    const addrCity = ref("");
    const jobInterest = ref([]);

    // API 데이터 로드
    const loadUserProfile = async () => {
      isLoading.value = true;
      try {
        const data = await fetchUserProfile(); // API 호출

        // 데이터 매핑
        name.value = data.name || "";
        phone.value = data.phone || "";
        gender.value = data.gender === "M" ? "male" : "female";
        selectedProvince.value = data.addrProvince || "";
        selectedCity.value = data.addrCity || "";
        careerStatus.value = data.exjobChk === "Y" ? "yes" : "no";
        jobInterest.value = data.jobInterest !== "N" ? [data.jobInterest] : [];
        // 경력 직종 매핑
        if (data.workHistoryJobs && Array.isArray(data.workHistoryJobs)) {
          selectedJobs.value = data.workHistoryJobs; // 경력 직종
        } else {
          selectedJobs.value = [""]; // 기본값
        }

        // 관심 직종 매핑
        if (data.interestJobs && Array.isArray(data.interestJobs)) {
          selectedInterestJobs.value = data.interestJobs; // 관심 직종
        } else {
          selectedInterestJobs.value = [""]; // 기본값
        }

        console.log("Mapped selectedJobs (경력 직종):", selectedJobs.value);
        console.log("Mapped selectedInterestJobs (관심 직종):", selectedInterestJobs.value);
      } catch (error) {
        errorMessage.value = "회원 정보를 불러오는 데 실패했습니다.";
        console.error(error);
      } finally {
        isLoading.value = false;
      }
    };

    const loadJobCategories = async () => {
      try {
        const jobs = await fetchJobs(); // fetchJobs 호출
        console.log("Fetched jobs:", jobs.data);
        jobCategories.value = jobs.data.map((job) => job.jobName);
      } catch (error) {
        console.error("Failed to fetch job categories:", error);
      }
    };

    // 컴포넌트 마운트 시 API 호출
    onMounted(() => {
      loadUserProfile();
      loadJobCategories();
    });

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
      onUpdateProfileClick,
      onDeleteAccountClick,
      isLoading,
      errorMessage,
      name,
      phone,
      gender,
      addrProvince,
      addrCity,
      jobInterest,
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
          <input class="input-field" placeholder="이름" v-model="name">
        </div>
        <!-- 휴대폰번호 입력 -->
        <div class="input-label">
          <span class="required">*</span>
          <input class="input-field" placeholder="휴대폰 번호" type="tel" v-model="phone">
        </div>
        <!-- 성별 선택 -->
        <div class="input-label">
          <span class="required">*</span>
          <select class="input-field" aria-label="성별 선택" v-model="gender">
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
          <select v-model="selectedCity" class="input-field" aria-label="거주 시">
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
        <div v-if="isJobCategoryEnabled" class="input-label job-category-section">
          <div v-for="(job, index) in selectedJobs" :key="index" class="job-category">
            <div class="select-wrapper">
              <select v-model="selectedJobs[index]" class="input-field" aria-label="직종 선택">
                <option value="" disabled selected>직종 선택</option>
                <option v-for="job in jobCategories" :key="job" :value="job">{{ job }}</option>
              </select>
            </div>
            <div class="button-wrapper">
              <div v-if="index === selectedJobs.length - 1 && selectedJobs.length < 3" @click="addJobField"
                   class="icon-button add-button">
                <img src="@/assets/images/icons/plus.png" alt="추가">
              </div>
              <div v-if="index > 0 && index === selectedJobs.length - 1" @click="removeJobField(index)"
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
        <div v-for="(interestJob, index) in selectedInterestJobs" :key="index" class="job-category">
          <div class="select-wrapper">
            <select v-model="selectedInterestJobs[index]" class="input-field" aria-label="관심 직종 선택">
              <option value="" disabled selected>관심 직종 선택</option>
              <option v-for="job in jobCategories" :key="job" :value="job">{{ job }}</option>
            </select>
          </div>
          <div class="button-wrapper">
            <div v-if="index === selectedInterestJobs.length - 1 && selectedInterestJobs.length < 3"
                 @click="addInterestJobField" class="icon-button add-button">
              <img src="@/assets/images/icons/plus.png" alt="추가">
            </div>
            <div v-if="index > 0 && index === selectedInterestJobs.length - 1" @click="removeInterestJobField(index)"
                 class="icon-button remove-button">
              <img src="@/assets/images/icons/minus.png" alt="제거">
            </div>
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
      :modal-message="'수정이 완료되었습니다.'"
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

</style>