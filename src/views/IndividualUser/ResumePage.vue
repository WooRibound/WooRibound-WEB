<script>
import { ref, onMounted } from "vue";
import ModalPopup from "@/components/SingleButtonModal.vue";
import {ROUTES} from "@/router/routes";
import {registerResume} from "@/api/services/individualUserService";

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

    const resume = ref({
      userName: "",
      userImg: "",
      userPhoneNumber: "",
      userEmail: "",
      introduction: ""
    });

    const photoPreview = ref(null); // 이미지 미리보기 URL 저장
    const isLoading = ref(false);

    const fetchResume = () => {
      const data = {
        userName: '이승준',
        userPhoneNumber: '010-1111-1111',
        userImg: require('@/assets/images/logo/id_photo_sample.png'), // 이미지 경로를 require로 수정
        userEmail: 'test@example.com',
        introduction: '자기소개 내용입니다.'
      };

      resume.value = data;
      if (data.userImg) {
        photoPreview.value = data.userImg;
      }
    };

    const onPhotoChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        photoPreview.value = URL.createObjectURL(file); // 미리보기 URL 생성
      }
    };

    const onUploadResumeClick = async () => {
      isLoading.value = true;
      console.log("Sending data:", resume.value);
      try {
        await registerResume(resume.value); // 서버로 데이터 전송
        modalPopupStatue.value = true; // 성공 시 모달 표시
      } catch (error) {
        console.error("Failed to upload resume:", error);
        alert("이력서 등록에 실패했습니다.");
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(() => {
      fetchResume();
    });

    return {
      modalPopupStatue,
      resume,
      photoPreview,
      onPhotoChange,
      onUploadResumeClick
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
          <img v-if="photoPreview" :src="photoPreview" class="photo-preview" />
        </div>
        <div class="file-upload-button">
          <label for="file">사진첨부</label>
          <input type="file" id="file" class="photo-input" @change="onPhotoChange" />
        </div>
      </div>
      <!-- 이름 -->
      <div class="input-section">
        <div class="input-label">
          <input class="input-field" placeholder="이름" v-model="resume.userName" readonly/>
        </div>
        <!-- 휴대폰번호 -->
        <div class="input-label">
          <input class="input-field" placeholder="휴대폰 번호" type="tel" v-model="resume.userPhoneNumber" readonly/>
        </div>
        <!-- 이메일 입력 -->
        <div class="input-label">
          <input class="input-field" placeholder="이메일" type="email" v-model="resume.userEmail"/>
        </div>
        <!-- 자기소개 글 입력 -->
        <div class="input-label">
          <span class="bold-text">자기소개 글</span>
          <textarea class="textarea-field" placeholder="자기소개를 입력하세요" v-model="resume.introduction" />
        </div>
        <div class="resume-update-button" @click="onUploadResumeClick">등록하기</div>
      </div>
    </div>
  </main>
  <modal-popup
      v-if="modalPopupStatue"
      @close-modal="modalPopupStatue = false"
      :modal-message="'이력서 등록(수정)이 완료되었습니다.'"
      :router-path="ROUTES.MAIN.path"
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
</style>
