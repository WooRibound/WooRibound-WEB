<script>
import { ref, onMounted } from "vue";
import { ROUTES } from "@/router/routes";
import { useRoute } from "vue-router";
import handleApiCall from '@/api/apiService';

export default {
  name: "ReadonlyResumePage",
  computed: {
    ROUTES() {
      return ROUTES
    }
  },
  setup() {
    const route = useRoute();

    const resume = ref({
      userName: "",
      jobPoint: 0,
      phone: "",
      addrCity: "",
      addrProvince: "",
      userImg: "",
      resumeEmail: "",
      userIntro: "",
      jobList: [],
    });

    const photoPreview = ref(null); // 이미지 미리보기 URL 저장

    const fetchResume = async (userId) => {
      try {
        const response = await handleApiCall('get', `/admin/individual/detail`, null, {
          params: { userId }
        });

        console.log(response.data)
        // API 응답 데이터로 resume 정보 업데이트
        resume.value = response.data;
        if (response.data.userImg) {
          photoPreview.value = response.data.userImg;
        }

      } catch (error) {
        console.error("fetchResume API 호출 오류:", error);
      }
    };

    onMounted(() => {
      const userId = route.params.id;  // 파라미터로 넘어온 userId 받기
      fetchResume(userId);
    });

    return {
      resume,
      photoPreview,
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
        <div class="wooribound-elevation-info">
          <img src="@/assets/images/icons/mountains.png" class="mountains-icon">
          <div class="elevation-text">우바고도 : {{ resume.jobPoint }}m</div>
        </div>

      </div>
      <!-- 이름 -->
      <div class="input-section">
        <div class="input-label">
          <input class="input-field" placeholder="이름" v-model="resume.userName" readonly
            @click="onMoveResumePageClick(1)" />
        </div>
        <!-- 휴대폰번호 -->
        <div class="input-label">
          <input class="input-field" placeholder="휴대폰 번호" type="tel" v-model="resume.phone" readonly />
        </div>
        <!-- 이메일  -->
        <div class="input-label">
          <input class="input-field" placeholder="이메일" type="email" v-model="resume.resumeEmail" readonly />
        </div>
        <!-- 주소 -->
        <div class="input-label">
          <input class="input-field" placeholder="주소" :value="resume.addrCity + ' ' + resume.addrProvince" readonly />
        </div>
        <!-- 경력 직종 -->
        <div class="input-label">
          <span class="bold-text">경력 직종</span>
          <input class="input-field" :value="resume.jobList.length > 0 ? resume.jobList.join(' / ') : ''"
            :placeholder="resume.jobList.length === 0 ? '없음' : ''" readonly />
        </div>
        <!-- 자기소개 글 입력 -->
        <div class="input-label">
          <span class="bold-text">자기소개 글</span>
          <textarea class="textarea-field" placeholder="자기소개서" v-model="resume.userIntro" readonly />
        </div>
      </div>
    </div>
  </main>
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

.photo-section {
  display: flex;
  align-items: end;
  gap: 85px;
  margin-bottom: 20px;
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
  margin-left: 3px;
  margin-bottom: 0px;
  margin-top: 7px;
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

.wooribound-elevation-info {
  display: flex;
  flex-direction: column;
  /* 요소를 수직으로 배치 */
  align-items: center;
  /* 수평 중앙 정렬 */
  gap: 10px;
  /* 아이콘과 텍스트 사이 간격 */
}

.mountains-icon {
  width: 110px;
  /* 아이콘의 너비 */
  height: 90px;
}

.elevation-text {
  font-size: 16px;
  color: #413F42;
  font-weight: bold;
}
</style>
