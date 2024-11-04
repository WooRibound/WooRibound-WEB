<script>
import {ref} from "vue";

export default {
  name: "HeaderComponent",
  setup(props, { emit }) {

    const showFullMenuState = ref(false);

    const onShowFullMenuClick = () => {
      showFullMenuState.value = !showFullMenuState.value;
      emit('fullMenu-state-changed', showFullMenuState.value);
    }
    return {
      showFullMenuState,
      onShowFullMenuClick,
    };
  }
}
</script>

<template>
  <header class="header">
    <router-link to="/">
      <img src="@/assets/images/logo/wooribound_logo.png" class="logo-image">
    </router-link>
    <img src="@/assets/images/icons/hamburger_button_menu.png" class="menu-icon" @click="onShowFullMenuClick">
  </header>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between; /* 양 끝에 배치 */
  align-items: center;            /* 수직 가운데 정렬 */
  background-color: #ffffff;      /* 배경 흰색 */
  padding: 0 10px;                /* 좌우 10px 패딩 */
  height: 60px;                   /* 일반적인 헤더 높이 */
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1); /* 살짝 그림자 */
}

.logo-image {
  width: 70%;                     /* 현재 이미지의 70% 크기로 조정 */
  max-width: 150px;               /* 최대 너비 제한 */
}

.menu-icon {
  width: 30px;                    /* 버튼 크기 설정 */
  height: 30px;
}
</style>