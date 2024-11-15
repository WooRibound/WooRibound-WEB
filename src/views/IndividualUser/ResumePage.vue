<script>
import { ref, onMounted } from "vue";
import ModalPopup from "@/components/SingleButtonModal.vue";
import {ROUTES} from "@/router/routes";
import {
  fetchIndividualUserResume,
  insertIndividualUserResume,
  updateIndividualUserResume
} from "@/api/services/individualUserService";
import {isEmailValid} from "@/utils/validators";

export default {
  name: "ResumePage",
  computed: {
    ROUTES() {
      return ROUTES
    }
  },
  components: {ModalPopup},
  setup() {
    const modalPopupStatue = ref(false);
    const modalMessage = ref("");

    const userImgSelect = ref(null);
    const resumeEmailSelect = ref(null);
    const userIntroSelect = ref(null);
    const isResumeFirst = ref(true);
    const emailError = ref(false);
    const photoPreview = ref(null);

    const initialResume = ref({
      userId: '',
      userImg: '',
      userName: '',
      userPhone: '',
      resumeEmail: '',
      userIntro: '',
    });

    const resume = ref({
      userId: '',
      userImg: '',
      userName: '',
      userPhone: '',
      resumeEmail: '',
      userIntro: '',
    });

    const fetchResume = async () => {
      try {
        const response = await fetchIndividualUserResume();
        resume.value = response;

        initialResume.value = { ...resume.value };

        if (resume.value.userImg) {
          photoPreview.value = resume.value.userImg;
        }

        isResumeFirst.value = !resume.value.userIntro;
      } catch (e) {
        console.log(e)
      }
    };

    const onPhotoChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const img = new Image();
        img.src = URL.createObjectURL(file); // 미리보기 URL 생성
        img.onload = () => {
          if (!(img.width <= 826 && img.height <= 1063)) {
            alert("826x1063px 이하의 이미지를 업로드해주세요.");
            return;
          }
          photoPreview.value = img.src;
          resume.value.userImg = file;
        }
      }
    };

    const onRegisterResumeClick = async () => {
      if (!photoPreview.value) {
        alert("사진을 첨부해주세요.");
        return;
      }

      if (
          (!resume.value.resumeEmail) ||
          (!isEmailValid(resume.value.resumeEmail))
      ) {
        alert("이메일을 입력해주세요.");
        resumeEmailSelect.value.focus();
        return;
      }

      if (!resume.value.userIntro) {
        alert("자기소개를 입력해주세요.");
        userIntroSelect.value.focus();
        return;
      }

      try {
        const response = await insertIndividualUserResume(resume.value);
        resume.value = response;

        if (resume.value.userImg) {
          photoPreview.value = resume.value.userImg;
        }

        isResumeFirst.value = !resume.value.userIntro;

        modalMessage.value = "등록이 완료 되었습니다";
        modalPopupStatue.value = true;
      } catch (e) {
        console.log(e);
      }
    }

    const onUpdateResumeClick = async () => {
      if ((resume.value.userImg !== initialResume.value.userImg) ||
          (resume.value.userName !== initialResume.value.userName) ||
          (resume.value.userPhone !== initialResume.value.userPhone) ||
          (resume.value.resumeEmail !== initialResume.value.resumeEmail) ||
          (resume.value.userIntro !== initialResume.value.userIntro)
      ) {

        if (!(resume.value.userImg instanceof File)) {
          delete resume.value.userImg;
        }

        const response = await updateIndividualUserResume(resume.value);
        resume.value = response;

        initialResume.value = { ...resume.value };

        if (resume.value.userImg) {
          photoPreview.value = resume.value.userImg;
        }

        isResumeFirst.value = !resume.value.userIntro;
        modalMessage.value = "수정이 완료 되었습니다";
      } else {
        modalMessage.value = "수정 된 사항이 없습니다";
      }

      modalPopupStatue.value = true;
    }

    const validateEmail = () => {
      emailError.value = !isEmailValid(resume.value.resumeEmail);
    };

    onMounted(() => {
      fetchResume();
    });

    return {
      modalPopupStatue,
      userImgSelect,
      resumeEmailSelect,
      userIntroSelect,
      resume,
      isResumeFirst,
      emailError,
      photoPreview,
      modalMessage,
      onPhotoChange,
      onRegisterResumeClick,
      onUpdateResumeClick,
      validateEmail,
    };
  }
};
</script>

<template>
  <main class="body">
    <div class="header">이력서</div>
    <div class="content">
      <!-- 사진 첨부 -->
      <div class="input-section photo-section">
        <div class="photo-label">
          <div v-if="!photoPreview">사진</div>
          <img v-if="photoPreview" :src="photoPreview" class="photo-preview"/>
        </div>
        <div class="file-upload-button">
          <label for="file">사진첨부</label>
          <input type="file" accept="image/*" id="file" class="photo-input" @change="onPhotoChange" ref="userImgSelect" />
        </div>
      </div>
      <!-- 이름 -->
      <div class="input-section">
        <div class="input-label">
          <input class="input-field" placeholder="이름" v-model="resume.userName" readonly />
        </div>
        <!-- 휴대폰번호 -->
        <div class="input-label">
          <input class="input-field" placeholder="휴대폰 번호" type="tel" v-model="resume.userPhone" readonly />
        </div>
        <!-- 이메일 입력 -->
        <div class="input-label">
          <input
              class="input-field"
              placeholder="이메일 주소 (예: example@domain.com)"
              type="email"
              v-model="resume.resumeEmail"
              @blur="validateEmail"
              ref="resumeEmailSelect"
          />
          <div v-if="emailError" class="error-message">이메일 형식을 맞춰주세요</div>
        </div>
        <!-- 자기소개 글 입력 -->
        <div class="input-label">
          <span class="bold-text">자기소개 글</span>
          <textarea
              class="textarea-field"
              placeholder="자기소개를 입력하세요"
              v-model="resume.userIntro"
              ref="userIntroSelect"
          />
        </div>
        <div
            class="resume-update-button"
            @click="onRegisterResumeClick"
            v-if="isResumeFirst"
        >
          등록하기
        </div>
        <div
            class="resume-update-button"
            @click="onUpdateResumeClick"
            v-else
        >
          수정하기
        </div>
      </div>
    </div>
  </main>
  <modal-popup
      v-if="modalPopupStatue"
      @close-modal="modalPopupStatue = false"
      :modal-message="modalMessage"
  />
</template>

<style scoped>
/* 기존 스타일 그대로 사용 */
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

.input-label {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.input-field {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  box-sizing: border-box;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #e1e1e1;
  color: #413F42;
}

.input-field[readonly] {
  background-color: #e0e0e0;
  color: #666;
  cursor: not-allowed;
}

.photo-section {
  display: flex;
  align-items: end;
  gap: 20px;
}

.photo-label {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 120px;
  background-color: #f1f1f1;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  overflow: hidden;
}

.photo-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.file-upload-button input[type="file"] {
  position: absolute;
  width: 0;
  height: 0;
  padding: 0;
  overflow: hidden;
  border: 0;
}

.file-upload-button label {
  display: inline-block;
  cursor: pointer;
  padding: 6px 12px;
  background-color: #024CAA;
  color: white;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  border-radius: 8px;
  border: none;
}

.bold-text {
  font-weight: bold;
  margin-left: 13px;
  margin-bottom: 5px;
}

.textarea-field {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  box-sizing: border-box;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #e1e1e1;
  color: #413F42;
  resize: vertical;
  min-height: 200px;
}

.resume-update-button {
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
  color: red;
  font-size: 0.875em;
  margin-bottom: 8px;
  margin-left: 8px;
}
</style>
