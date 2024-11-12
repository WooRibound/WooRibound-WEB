<script>
import { ref, onMounted } from "vue";
import { ROUTES } from "@/router/routes";
import { useRoute } from "vue-router";
import handleApiCall from '@/api/apiService';

export default {
  name: "CorporateUserProfileReadonly",
  computed: {
    ROUTES() {
      return ROUTES
    }
  },
  setup() {
    const route = useRoute();

    const enterprise = ref({
      entId: "",
      ceoName: "",
      entName: "",
      regNum: "",
      entAddr1: "",
      entAddr2: "",
      entSize: null,
      entField: "",
      revenue: 0
    });

    const fetchEnterprise = async (entId) => {
      try {
        const response = await handleApiCall('get', `/admin/enterprise/detail`, null, {
          params: { entId }
        });

        enterprise.value = response.data;

      } catch (error) {
        console.error("fetchEnterprise API 호출 오류:", error);
      }
    };

    onMounted(() => {
      const entId = route.params.id;
      fetchEnterprise(entId);
    });

    return {
      enterprise,
    };
  }
}
</script>

<template>
  <main class="body">
    <div class="header">기업 정보</div>
    <div class="content">
      <div class="input-section">
        <!-- 아이디 입력 -->
        <div class="input-label">
          <span class="input-title">아이디</span>
          <input class="input-field" placeholder="아이디" v-model=enterprise.entId readonly />
        </div>
        <div class="input-label">
          <span class="input-title">대표자명</span>
          <input class="input-field" placeholder="대표자명" v-model=enterprise.ceoName readonly>
        </div>
        <div class="input-label">
          <span class="input-title">기업명</span>
          <input class="input-field" placeholder="기업명" v-model=enterprise.entName readonly>
        </div>
        <div class="input-label">
          <span class="input-title">사업자 번로</span>
          <input class="input-field" placeholder="사업자 번호" v-model=enterprise.regNum readonly>
        </div>
        <div class="input-label">
          <span class="input-title">주소</span>
          <input class="input-field" placeholder="주소" :value="enterprise.entAddr1 + ' ' + enterprise.entAddr2"
            readonly />
        </div>
        <div class="input-label">
          <span class="input-title">기업 규모</span>
          <input class="input-field" placeholder="기업 규모" v-model=enterprise.entSize readonly>
        </div>
        <div class="input-label">
          <span class="input-title">산업</span>
          <input class="input-field" placeholder="산업" v-model=enterprise.entField readonly>
        </div>
        <div class="input-label">
          <span class="input-title">매출액</span>
          <input class="input-field" placeholder="매출액" v-model=enterprise.revenue readonly>
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
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.input-title {
  margin-right: 5px;
  /* 입력 필드와의 간격 */
  width: 30%;
  font-weight: bold;
}

.input-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  flex: 1;
}

.input-label {
  display: flex;
  align-items: center;
  width: 100%;
}

.input-title {
  margin-right: 5px;
}

.input-field {
  width: 100%;
  padding: 10px;
  margin: 10px 10px 10px 0;
  /* 오른쪽 여백 추가 */
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
</style>
