<script>
import { ref, computed, nextTick, onMounted } from 'vue';
import ModalPopup from "@/components/SingleButtonModal.vue";
import { ROUTES } from "@/router/routes";
import { searchAddress } from "@/utils/addressFinder";
import { fetchEnterprise, updateEnterpriseInfo } from "@/api/services/corporateUserService";

export default {
  name: "CorporateUserProfile",
  computed: {
    ROUTES() {
      return ROUTES;
    },
    isModified() {
      const requiredFields = [
        'ceoName',
        'entName',
        'regNum',
        'entAddr1',
        'entAddr2',
        'entSize',
        'entField'
      ];

      const hasEmptyField = requiredFields.some(field =>
        !this.enterprise[field] ||
        this.enterprise[field].toString().trim() === ''
      );

      const isRevenueValid = parseInt(this.revenue) >= 0;

      if (hasEmptyField || !isRevenueValid) {
        return false;
      }

      const enterpriseModified = Object.keys(this.originalInfo).some(key =>
        this.originalInfo[key] !== this.enterprise[key]
      );

      const revenueModified = this.originalInfo.revenue !== parseInt(this.revenue);

      return enterpriseModified || revenueModified;
    }
  },
  components: { ModalPopup },
  setup() {
    const modalPopupStatue = ref(false);
    const modalMessage = ref("");
    const idInput = ref("");

    const industries = ref([
      "제조업", "요식업", "IT",
      "금융업", "서비스업", "건설업",
      "운수업", "농업/어업", "제약/생명과학",
      "교육업", "의료업", "예술/문화",
      "관광/레저", "의류", "기타",
    ]);

    const revenue = ref("");

    const formattedRevenue = computed({
      get() {
        return revenue.value ? new Intl.NumberFormat('ko-KR').format(revenue.value) : "";
      },
      set(value) {
        revenue.value = value.replace(/,/g, '');
        enterprise.value.revenue = parseInt(revenue.value) || 0;
      }
    });

    const formatRevenue = (event) => {
      const input = event.target.value;
      const sanitizedInput = input.replace(/[^0-9,]/g, '');
      formattedRevenue.value = sanitizedInput;
    };

    const onAddressSearchClick = async () => {
      try {
        await nextTick();
        const result = await searchAddress();
        if (result) {
          enterprise.value.entAddr1 = result.address;

          nextTick(() => {
            const detailInput = document.querySelector('input[placeholder="상세 주소"]');
            if (detailInput) detailInput.focus();
            const len = detailInput.value.length;
            detailInput.setSelectionRange(len, len);
          });
        }
      } catch (error) {
        console.error('주소 검색 중 오류 발생:', error);
      }
    };

    const onUpdateProfilerClick = async () => {
      try {
        await updateEnterpriseInfo(enterprise.value);
        originalInfo.value = { ...enterprise.value };

        modalMessage.value = "수정이 완료 되었습니다.";
        modalPopupStatue.value = true;
      } catch (error) {
        console.error("API 호출 중 오류 발생:", error);
      }
    };

    const originalInfo = ref({
      entId: "",
      ceoName: "",
      entName: "",
      regNum: "",
      entAddr1: "",
      entAddr2: "",
      entSize: "",
      entField: "",
      revenue: 0
    });

    const enterprise = ref({
      entId: "",
      ceoName: "",
      entName: "",
      regNum: "",
      entAddr1: "",
      entAddr2: "",
      entSize: "",
      entField: "",
      revenue: 0
    });

    const fetchEnterpriseInfo = async () => {
      try {
        const response = await fetchEnterprise();
        originalInfo.value = { ...response };
        enterprise.value = { ...response };
        revenue.value = response.revenue?.toString() || "0";
        console.info("enterprise.value: ",enterprise.value);
      } catch (error) {
        console.error("fetchEnterprise API 호출 오류:", error);
      }
    };

    onMounted(() => {
      fetchEnterpriseInfo();
    });

    return {
      modalPopupStatue,
      modalMessage,
      industries,
      formattedRevenue,
      revenue,
      idInput,
      formatRevenue,
      onAddressSearchClick,
      onUpdateProfilerClick,
      originalInfo,
      enterprise,
    };
  }
}
</script>

<template>
  <main class="body">
    <div class="header">기업 정보</div>
    <div class="subtitle">기업정보 수정</div>
    <div class="content">
      <div class="input-section">
        <!-- 아이디 입력 -->
        <div class="input-label">
          <span class="input-title">아이디</span>
          <input class="input-field" placeholder="아이디" v-model="enterprise.entId" readonly />
        </div>
        <!-- 대표자명 입력 -->
        <div class="input-label">
          <span class="input-title">대표자명</span>
          <input class="input-field" placeholder="대표자명" v-model="enterprise.ceoName">
        </div>
        <!-- 기업명 입력 -->
        <div class="input-label">
          <span class="input-title">기업명</span>
          <input class="input-field" placeholder="기업명" v-model="enterprise.entName">
        </div>
        <!-- 사업자번호 입력 -->
        <div class="input-label">
          <span class="input-title">사업자 번호</span>
          <input class="input-field" placeholder="사업자 번호" v-model="enterprise.regNum" readonly>
        </div>
        <!-- 주소 입력 -->
        <div class="input-label">
          <span class="input-title">주소</span>
          <div style="display: flex; width: 70%;">
            <input class="addr-field" placeholder="주소" v-model="enterprise.entAddr1" />
            <button class="addr-search-button" @click="onAddressSearchClick">검색</button>
          </div>
        </div>
        <!-- 상세주소 입력 -->
        <div class="input-label">
          <span class="input-title"></span>
          <input class="addr-detail-field" placeholder="상세 주소" v-model="enterprise.entAddr2">
        </div>
        <!-- 기업 규모 선택 -->
        <div class="input-label">
          <span class="input-title">기업 규모</span>
          <select class="input-field" v-model="enterprise.entSize">
            <option value="" disabled selected>기업 규모</option>
            <option value="LARGE">대기업</option>
            <option value="MEDIUM">중견기업</option>
            <option value="SMALL">중소기업</option>
            <option value="STARTUP">스타트업</option>
          </select>
        </div>
        <!-- 산업 선택 -->
        <div class="input-label">
          <span class="input-title">산업</span>
          <select class="input-field" v-model="enterprise.entField">
            <option value="" disabled selected>산업</option>
            <option v-for="industry in industries" :key="industry" :value="industry"> {{ industry }} </option>
          </select>
        </div>
        <!-- 매출액 입력 -->
        <div class="input-label">
          <span class="input-title">매출액</span>
          <input class="input-field" placeholder="매출액" type="text" v-model="formattedRevenue" @input="formatRevenue" />
        </div>
        <!-- 수정하기 버튼 -->
        <div
            class="modify-button"
            @click="onUpdateProfilerClick"
            :class="{ 'disabled-button': !isModified }"
            :style="{
    backgroundColor: isModified ? '#024CAA' : '#e0e0e0',
    cursor: isModified ? 'pointer' : 'not-allowed',
    pointerEvents: isModified ? 'auto' : 'none'
  }"
        >
          수정하기
        </div>
      </div>
    </div>
  </main>
  <modal-popup v-if="modalPopupStatue" @close-modal="modalPopupStatue = false" :modal-message="modalMessage" />
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

.subtitle {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.input-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 80%;
  max-width: 600px;
  margin: 0 auto;
}

.input-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 15px;
}

.input-title {
  width: 30%;
  font-weight: bold;
}

.input-field {
  width: 70%;
  padding: 10px;
  box-sizing: border-box;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #e1e1e1;
  color: #413F42;
}

.addr-field {
  flex: 1;
  padding: 10px;
  box-sizing: border-box;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #e1e1e1;
  color: #413F42;
  margin-right: 10px;
}

.addr-detail-field {
  width: 70%;
  padding: 10px;
  box-sizing: border-box;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #e1e1e1;
  color: #413F42;
  margin-left: 0;
  align-self: flex-end;
}


.required {
  color: #F60F0F;
  margin-right: 5px;
}

.addr-search-button {
  flex-shrink: 0;
  padding: 0 15px;
  background-color: #024CAA;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  height: 40px;
  white-space: nowrap;
}

.addr-search-button:hover {
  background-color: #023c7a;
}

.modify-button {
  width: 90%;
  padding: 10px;
  margin: 20px auto 0 auto;
  background-color: #024CAA;
  color: white;
  text-align: center;
  cursor: pointer;
  font-weight: bold;
  border-radius: 8px;
}

.error-message {
  color: #C62E2E;
}

.success-message {
  color: #133E87;
}

.input-field[readonly] {
  background-color: #e0e0e0;
  color: #666;
  cursor: not-allowed;
}
</style>
