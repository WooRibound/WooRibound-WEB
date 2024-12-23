<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: "DeletedUserRedirectView",
  setup() {
    const titleText = "탈퇴한 유저입니다.";
    const subText = "회원가입을 새로 진행해 주세요.";
    const imageSource = require("@/assets/images/icons/deleted_user.png");

    return {
      titleText,
      subText,
      imageSource,
    };
  },
});
</script>

<template>
  <main class="body">
    <div class="content_wrap">
      <div class="title">{{ titleText }}</div>
      <div class="sub_text">{{ subText }}</div>
      <div class="image_wrap">
        <img class="user_image" :src="imageSource" v-if="imageSource" alt="탈퇴한 유저" />
      </div>
    </div>
  </main>
</template>

<style scoped>
.body {
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.content_wrap {
  text-align: center;
  padding: 40px;
  border-radius: 12px;
}

.title {
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 16px;
  color: #333;
}

.sub_text {
  font-size: 16px;
  color: #666;
  margin-bottom: 32px;
}

.image_wrap {
  display: flex;
  justify-content: center;
  align-items: center;
}

.user_image {
  width: 200px;
  height: auto;
}
</style>