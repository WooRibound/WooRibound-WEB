<script>
import ModalPopup from "@/components/SingleButtonModal.vue";
import {ROUTES} from "@/router/routes";
import {computed, ref} from "vue";
import {useJobStore} from "@/stores/useJobStore";
import {insertJobPosting} from "@/api/services/corporateUserService";

export default {
  name: "JobPostingRegister",
  computed: {
    ROUTES() {
      return ROUTES
    }
  },
  components: {ModalPopup},
  setup() {
    const jobStore = useJobStore();

    const startDateInput = ref(null);
    const endDateInput = ref(null);

    const modalPopupStatue = ref(false);
    const modalMessage = ref("");
    const photoPreview = ref(null);
    const jobs = computed(() => jobStore.getJobs);
    const errorMessage = ref("");

    const jobPosting = ref({
      postImg: null,
      postTitle: '',
      jobId: '',
      startDate: '',
      endDate: '',
    });

    const activateDatePicker = () => {
      if (startDateInput.value) {
        startDateInput.value.type = 'date';
        startDateInput.value.showPicker();  // 달력 직접 호출
      }
    };

    const deactivateDatePicker = () => {
      if (startDateInput.value && !startDateInput.value.value) {
        startDateInput.value.type = 'text';
      }
    };

    const activateEndDatePicker = () => {
      if (endDateInput.value) {
        endDateInput.value.type = 'date';
        endDateInput.value.showPicker();  // 달력 직접 호출
      }
    };

    const deactivateEndDatePicker = () => {
      if (endDateInput.value && !endDateInput.value.value) {
        endDateInput.value.type = 'text';
      }
    };

    const onPhotoChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          photoPreview.value = reader.result; // 미리보기 이미지 설정
          jobPosting.value.postImg = file; // 파일 정보 저장
        };
        reader.readAsDataURL(file);
      }
    };

    const onImageRegisterClick = () => {
      const inputFile = document.getElementById("file");
      inputFile.click();
    };

    const onRegisterClick = async () => {
      if (!validateForm()) return;

      try {
        const response = await insertJobPosting(jobPosting.value);
        modalMessage.value = response;
        modalPopupStatue.value = true;
        console.log("공고등록 API 호출 시작 : " + response);
      } catch (e) {
        console.log(e);
      }
    }

    const validateForm = () => {
      if (!jobPosting.value.postImg) {
        errorMessage.value = "공고 이미지를 첨부해주세요.";
        return false;
      }
      if (!jobPosting.value.postTitle) {
        errorMessage.value = "공고 제목을 입력해주세요.";
        return false;
      }
      if (!jobPosting.value.jobId) {
        errorMessage.value = "공고 직종을 선택해주세요.";
        return false;
      }
      if (!jobPosting.value.startDate) {
        errorMessage.value = "공고 시작 날짜를 지정해주세요.";
        return false;
      }
      if (!jobPosting.value.endDate) {
        errorMessage.value = "공고 마감 날짜를 지정해주세요.";
        return false;
      }
      return true;
    };


    return {
      errorMessage,
      validateForm,
      startDateInput,
      endDateInput,
      activateDatePicker,
      deactivateDatePicker,
      activateEndDatePicker,
      deactivateEndDatePicker,
      jobs,
      modalPopupStatue,
      photoPreview,
      jobPosting,
      modalMessage,
      onPhotoChange,
      onRegisterClick,
      onImageRegisterClick,
    };
  }
}
</script>

<template>
  <main class="body">
    <div class="header">공고 관리</div>
    <div class="subtitle">공고 등록</div>
    <div class="content">
      <div class="input-section">
        <!-- 공고 이미지 등록 -->`
        <div class="photo-label">
          <div v-if="!photoPreview" class="photo-placeholder">사진 (권장사이즈 : 900px x 300px) </div>
          <img v-if="photoPreview" :src="photoPreview" class="photo-preview"  alt=""/>
          <button class="image-register-button" @click="onImageRegisterClick">사진등록</button>
          <input
              type="file"
              accept="image/*"
              id="file"
              class="photo-input"
              @change="onPhotoChange"
              style="display: none"
          />
        </div>
        <!-- 공고제목 입력  -->
        <div class="input-label">
          <span class="required">*</span>
          <input class="input-field" placeholder="공고 제목" v-model="jobPosting.postTitle" />
        </div>
        <!-- 직종 선택  -->
        <div class="input-label">
          <span class="required">*</span>
          <select v-model="jobPosting.jobId" class="input-field" aria-label="직종 선택">
            <option value="" disabled>직종 선택</option>
            <option v-for="job in jobs" :key="job.jobName" :value="job.jobId">{{ job.jobName }}</option>
          </select>
        </div>
        <!-- 공고 시작 일자 입력 -->
        <div class="input-label">
          <span class="required">*</span>
          <input
              ref="startDateInput"
              type="text"
              placeholder="공고 시작 일자"
              @focus="activateDatePicker"
              @blur="deactivateDatePicker"
              v-model="jobPosting.startDate"
              class="input-field date-picker-input"
          />
        </div>
        <!-- 공고 시작 마감 입력 -->
        <div class="input-label">
          <span class="required">*</span>
          <input
              ref="endDateInput"
              type="text"
              placeholder="공고 마감 일자"
              @focus="activateEndDatePicker"
              @blur="deactivateEndDatePicker"
              v-model="jobPosting.endDate"
              class="input-field date-picker-input"
          />
        </div>
        <div v-if="errorMessage" class="error-message-container">
          {{ errorMessage }}
        </div>
        <div class="delete-button" @click="onRegisterClick">공고 등록</div>
      </div>
    </div>
  </main>
  <modal-popup
      v-if="modalPopupStatue"
      @close-modal="modalPopupStatue = false"
      :modal-message="modalMessage"
      :router-path="ROUTES.JOB_POSTING_MANAGEMENT.path"
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

/* 모든 input 필드의 스타일 */
.input-field {
  width: 100%;
  padding: 10px;
  margin: 10px 0; /* 위아래 간격 */
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #e1e1e1;
  box-sizing: border-box;
}

/* 날짜 필드를 감싸는 래퍼 */
.custom-date-wrapper {
  position: relative;
  width: 100%;
}

/* 날짜 필드 스타일 */
.custom-date-input {
  width: 100%;
  padding: 10px; /* 다른 필드와 동일한 패딩 */
  border-radius: 8px; /* 다른 필드와 동일한 테두리 둥근 정도 */
  border: 1px solid #e1e1e1;
  font-size: 16px;
  color: transparent; /* 기본 텍스트 숨기기 */
  background-color: transparent;
  appearance: none; /* 기본 브라우저 UI 제거 */
  -webkit-appearance: none; /* WebKit 기반 브라우저 */
  -moz-appearance: none; /* Mozilla 기반 브라우저 */
  position: relative;
  z-index: 1;
}

/* 날짜 입력 시 텍스트 표시 */
.custom-date-input:focus,
.custom-date-input:not(:placeholder-shown) {
  color: black;
}

/* 커스텀 플레이스홀더 스타일 */
.custom-placeholder {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  color: #999;
  pointer-events: none; /* 클릭되지 않도록 설정 */
}

.custom-date-input:not(:placeholder-shown) + .custom-placeholder,
.custom-date-input:focus + .custom-placeholder {
  display: none; /* 값 입력 시 플레이스홀더 숨김 */
}

/* 날짜 입력 필드 스타일 */
.date-input {
  position: relative;
  width: 100%;
  padding: 10px;
  padding-right: 40px; /* 아이콘과 텍스트 간격 확보 */
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #e1e1e1;
  background: url("@/assets/images/icons/calender.png") no-repeat right 10px center / 25px auto, #fff;
  box-sizing: border-box;
  appearance: none; /* 기본 브라우저 UI 제거 */
  -webkit-appearance: none; /* WebKit 기반 브라우저 */
  -moz-appearance: none; /* Mozilla 기반 브라우저 */
}

/* 필수 표기 스타일 */
.required {
  color: #F60F0F; /* 빨간색 필수 표기 */
  margin-right: 5px; /* 입력 필드와 간격 */
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
.add-button img,
.remove-button img {
  width: 24px;
  height: 24px;
}

.date-picker-input {
  padding-right: 40px !important; /* 아이콘을 위한 여백 */
  background: url("@/assets/images/icons/calender.png") no-repeat right 10px center / 25px auto, #fff !important;
}

input[type="date"] {
  position: relative;
  padding-right: 40px; /* 아이콘과 텍스트 간격 */
  background: url("@/assets/images/icons/calender.png") no-repeat right 10px center / 25px auto, #fff !important;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  font-size: 16px;
  appearance: none;
  -webkit-appearance: none; /* WebKit 브라우저 기본 스타일 제거 */
  -moz-appearance: none; /* Firefox 기본 스타일 제거 */
}

input[type="date"]::-webkit-calendar-picker-indicator {
  display: none;
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

.photo-label {
  position: relative;
  width: 100%;
  height: 200px;
  margin-bottom: 20px;
  border: 1px dashed #ccc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.photo-placeholder {
  font-size: 16px;
  color: #999;
}

.photo-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-register-button {
  position: absolute;
  bottom: 10px;
  right: 10px;
  padding: 5px 10px;
  background-color: #024caa;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
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

</style>