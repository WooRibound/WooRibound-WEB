<script>
import { ref } from 'vue';
import MenuGuidePopup from "@/components/MenuGuidePopup.vue";
import {ROUTES} from "@/router/routes";

export default {
  name: "BottomNavigation",
  computed: {
    ROUTES() {
      return ROUTES
    }
  },
  components: { MenuGuidePopup },
  setup() {
    const menuGuidePopupStatue = ref(false);

    const icons = {
      home: require('@/assets/images/icons/home.png'),
      company: require('@/assets/images/icons/company.png'),
      wisdom: require('@/assets/images/icons/wisdom.png'),
      user: require('@/assets/images/icons/user.png')
    };

    const hoverIcons = {
      home: require('@/assets/images/icons/home_hover.png'),
      company: require('@/assets/images/icons/company_hover.png'),
      wisdom: require('@/assets/images/icons/wisdom_hover.png'),
      user: require('@/assets/images/icons/user_hover.png')
    };

    const currentIcon = ref({
      home: true,
      education: true,
      company: true,
      user: true
    });

    const showMenuGuide = ref({
      home: false,
      education: false,
      company: false,
      user: false
    });

    const mouseEnter = (icon) => {
      currentIcon.value[icon] = false; // Hover 시 기본 아이콘 숨김
    };

    const mouseLeave = (icon) => {
      currentIcon.value[icon] = true; // Hover 해제 시 기본 아이콘 표시
    };

    const onShowMenuGuideClick = () => {
      menuGuidePopupStatue.value = !menuGuidePopupStatue.value;
    };

    return {
      menuGuidePopupStatue,
      icons,
      hoverIcons,
      currentIcon,
      showMenuGuide,
      mouseEnter,
      mouseLeave,
      onShowMenuGuideClick
    };
  }
}
</script>

<template>
  <nav class="bottom-navigation">
    <ul class="bottom-nav-list">
      <li class="bottom-nav-item">
        <router-link :to="ROUTES.MAIN.path"
                     @mouseenter="mouseEnter('home')"
                     @mouseleave="mouseLeave('home')"
        >
          <img :src="currentIcon.home ? icons.home : hoverIcons.home" alt="홈" class="nav-icon" />
          홈
        </router-link>
      </li>
      <li class="bottom-nav-item">
        <router-link :to="ROUTES.JOB_MENU.path"
                     @mouseenter="mouseEnter('company')"
                     @mouseleave="mouseLeave('company')"
        >
          <img :src="currentIcon.company ? icons.company : hoverIcons.company" alt="채용공고" class="nav-icon" />
          채용 공고
        </router-link>
      </li>
      <li class="bottom-nav-item">
        <router-link :to="ROUTES.WISDOM_EXPLORE.path"
                     @mouseenter="mouseEnter('wisdom')"
                     @mouseleave="mouseLeave('wisdom')"
        >
          <img :src="currentIcon.wisdom ? icons.wisdom : hoverIcons.wisdom" alt="지혜" class="nav-icon" />
          지혜 마당
        </router-link>
      </li>
      <li class="bottom-nav-item">
        <a href="#"
           @mouseenter="mouseEnter('user')"
           @mouseleave="mouseLeave('user')"
           @click="onShowMenuGuideClick">
          <img :src="currentIcon.user ? icons.user : hoverIcons.user" alt="마이" class="nav-icon" />
          마이
        </a>
      </li>
    </ul>
  </nav>
  <menu-guide-popup
      v-if="menuGuidePopupStatue"
      @close-modal="menuGuidePopupStatue = false"
  />
</template>

<style scoped>
.bottom-nav-list {
  display: flex;           /* 수평 정렬 */
  list-style: none;       /* 기본 리스트 스타일 제거 */
  margin: 0;              /* 기본 마진 제거 */
  padding: 0 10px;        /* 기본 패딩 제거 */
  justify-content: space-between;
}

.bottom-nav-item {
  text-align: center;      /* 텍스트 가운데 정렬 */
}

.bottom-nav-item a {
  text-decoration: none;    /* 링크 기본 스타일 제거 */
  color: #333;             /* 텍스트 색상 */
  display: flex;           /* Flexbox 사용 */
  flex-direction: column;  /* 수직 정렬 */
  align-items: center;     /* 수평 가운데 정렬 */
}

.nav-icon {
  width: 24px;             /* 아이콘 크기 설정 (필요에 따라 조정) */
  height: 24px;            /* 아이콘 높이 설정 */
  margin-bottom: 5px;      /* 아이콘과 텍스트 간격 */
}
</style>
