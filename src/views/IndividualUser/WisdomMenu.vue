<script>
import {useRouter} from "vue-router";
import {ROUTES} from "@/router/routes";

export default {
  name: "WisdomMenu",
  setup() {
    const router = useRouter();
    const navigateToWisdom = (viewType) => {
      if (viewType === 'share') {
        router.push({
          name: ROUTES.WISDOM_SHARE.name,
          params:{
            viewType: viewType
          },
        })
      }

      if (viewType === 'explore') {
        router.push({
          name: ROUTES.WISDOM_EXPLORE.name,
          params:{
            viewType: viewType
          },
        })
      }
    };

    return {
      navigateToWisdom,
    };
  }
}
</script>

<template>
  <main class="body">
    <div class="header">지혜 마당</div>
    <div class="job-options">
      <div class="job-option share" @click="navigateToWisdom('share')">
        지혜
        <br>
        나누기
      </div>
      <div class="job-option explore" @click="navigateToWisdom('explore')">
        지혜
        <br>
        탐색
      </div>
    </div>
  </main>
</template>

<style scoped>
.body {
  flex: 1;                      /* 가변 영역, 헤더와 바텀 내비게이션을 제외한 나머지 공간 차지 */
  padding: 20px;                /* 내부 여백 */
  box-sizing: border-box;       /* 패딩을 포함한 크기 계산 */
  background-color: #f8f9fa;    /* 배경색 */
  overflow-y: auto;             /* 내용이 넘칠 경우 스크롤 가능 */
  display: flex;                /* Flexbox 사용 */
  flex-direction: column;       /* 세로 정렬 */
}

.header {
  font-size: 24px;              /* 헤더 폰트 크기 */
  font-weight: bold;            /* 헤더 두껍게 */
  margin-bottom: 20px;          /* 아래쪽 여백 */
}

.job-options {
  display: flex;                /* 옵션을 가로로 정렬 */
  gap: 10px;                   /* 옵션 사이의 간격 */
  justify-content: center;      /* 수평 중앙 정렬 */
  margin-top: auto;            /* 상단 여백을 자동으로 설정하여 중앙 정렬 */
  margin-bottom: auto;          /* 하단 여백을 자동으로 설정하여 중앙 정렬 */
  flex-wrap: wrap;              /* 아이템이 넘칠 경우 줄 바꿈 허용 */
}

.job-option {
  border-radius: 15px;         /* 테두리 둥글게 */
  border-style: solid;         /* 테두리 스타일 */
  border-width: 1px;           /* 테두리 두께 */
  width: 100px;                /* 모바일에서 너비를 줄임 */
  height: 180px;               /* 모바일에서 높이를 줄임 */
  display: flex;               /* Flexbox 사용 */
  flex-direction: column;      /* 수직 정렬 */
  align-items: center;         /* 수평 가운데 정렬 */
  justify-content: center;      /* 수직 가운데 정렬 */
  text-align: center;          /* 텍스트 가운데 정렬 */
  font-weight: bold;
  color: #FFFFFF;
  font-size: 16px;             /* 모바일에서 폰트 크기를 줄임 */
}

.share {
  background: #5b99c2;
  border-color : #5b99c2;
}

.explore {
  background: #1F316F;
  border-color: #1F316F;
}

/* 화면 사이즈가 커질 때의 스타일 */
@media (min-width: 768px) {
  .header {
    font-size: 2em;
  }
  .job-options {
    gap: 20px;
  }
  .job-option {
    width: 290px;             /* 너비 변경 */
    height: 360px;           /* 높이 변경 */
    font-size: 2em;         /* 폰트 크기 2.5배 증가 */
  }
}
</style>