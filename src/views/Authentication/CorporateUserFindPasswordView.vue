<script>
export default {
  name: "CorporateUserFindPasswordView",
  setup() {
    const onFindPasswordClick = () => {
      // todo 비밀번호 찾기 API 구현 시 아래에 로직 추가하기
    }
    return {
      onFindPasswordClick
    };
  }
}
</script>

<template>
  <main class="body">
    <div class="header">비밀번호 찾기</div>
    <div class="content">
      <div class="input-section">
        <input class="input-field" placeholder="아이디">
        <input class="input-field" placeholder="휴대폰 번호" type="tel">
        <div class="delete-button" @click="onFindPasswordClick">비밀번호 찾기</div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.body {
  display: flex;                /* 플렉스 박스 모델 사용 */
  flex-direction: column;       /* 세로 방향으로 배치 */
  justify-content: center;      /* 수직 중앙 정렬 */
  flex: 1;                      /* 가변 영역 */
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

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 130px;
  flex: 1;                      /* 가변 영역 */
  height: 100%;                 /* 전체 높이를 사용하도록 설정 */
}

.input-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 300px;
}

.input-field {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  box-sizing: border-box;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #413F42;
}

.delete-button {
  width: 95%;
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