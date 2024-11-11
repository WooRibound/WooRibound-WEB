<script>
import {ref} from "vue";

export default {
  name: "UserLogAnalysis",
  setup() {
    const searchInput = ref("");
    return {
      searchInput
    };
  }
}
</script>

<template>
  <main class="body">
    <div class="header">
      <div class="header-title">사용자 로그 분석</div>
    </div>
    <div class="search-wrap">
      <input
          class="search-input"
          placeholder="게시물 제목을 입력하세요"
          type="text"
          v-model="searchInput"
          @keyup.enter="searchPosts"
      >
      <div class="filter-section">
        <div class="filter-item"
             @click="onFilterClick(SEARCH_FILTER_TYPES.JOB)"
             :style="{ color: selectedJob === '전체 직무' ? 'black' : '#024CAA' }">
          {{ selectedJob }}
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.body {
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f8f9fa;
  overflow-y: auto;
}

.header {
  display: flex;
  justify-content: space-between; /* 두 요소를 양 끝에 배치 */
  align-items: center; /* 세로 정렬을 가운데로 */
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}
</style>