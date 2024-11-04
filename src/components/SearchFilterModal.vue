<script>
import {computed} from "vue";
import {SEARCH_FILTER_TYPES} from "@/constants/searchFilterTypes";
import { useRegionsStore } from "@/stores/useRegionsStore";

export default {
  name: "SearchFilterModal",
  computed: {
    SEARCH_FILTER_TYPES() {
      return SEARCH_FILTER_TYPES
    }
  },
  props: {
    filterType: {
      type: String,
      required: true,
    },
  },
  setup(props, {emit}) {
    const regionsStore = useRegionsStore();
    const provinces = computed(() => {
      const originalProvinces = regionsStore.getProvinces;
      return ["전체 지역", ...originalProvinces]; // "전체"를 첫 번째 요소로 추가
    });
    const selectedFilterType = computed(() => props.filterType);

    const closeModal = () => {
      emit('close-modal', false);
    };

    const halfLength = Math.ceil(provinces.value.length / 2);
    const leftProvinces = computed(() => provinces.value.slice(0, halfLength));
    const rightProvinces = computed(() => provinces.value.slice(halfLength));

    const selectProvince = (province) => {
      emit("select-province", {
        filterType: selectedFilterType.value,
        province: province,
      });
      closeModal();
    };

    return {
      closeModal,
      selectProvince,
      selectedFilterType,
      leftProvinces,
      rightProvinces,
    };
  }
}
</script>

<template>
  <div class="modal-overlay">
    <div class="menu-content" v-if="selectedFilterType === SEARCH_FILTER_TYPES.JOB">
      <div class="menu_title">
        직무
        <div class="close-button" @click="closeModal">
          <img src="@/assets/images/icons/close.png" alt="Close" />
        </div>
      </div>
      <div class="menu-items">
        <div class="menu-item">지원 현황</div>
      </div>
    </div>
    <div class="menu-content" v-if="selectedFilterType === SEARCH_FILTER_TYPES.REGIONS">
      <div class="menu_title">
        지역
        <div class="close-button" @click="closeModal">
          <img src="@/assets/images/icons/close.png" alt="Close" />
        </div>
      </div>
      <div class="menu-items">
        <div class="menu-column">
          <div
              class="menu-item"
              v-for="(province, index) in leftProvinces"
              :key="index"
              @click="selectProvince(province)"
          >
            {{ province }}
          </div>
        </div>
        <div class="menu-column">
          <div
              class="menu-item"
              v-for="(province, index) in rightProvinces"
              :key="index"
              @click="selectProvince(province)"
          >
            {{ province }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100% - 72px);
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 999;
}

.menu-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 100%;
  height: 70%;
  margin-bottom: 0;
}

.menu_title {
  display: flex; /* 플렉스 박스 사용 */
  justify-content: space-between; /* 양쪽 끝 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 15px;
}

.menu-items {
  margin-top: 15px;
  font-size: 19px;
  display: flex; /* 플렉스 박스 사용 */
}

.menu-column {
  flex: 1; /* 각 열이 동일한 너비를 가짐 */
  padding: 0 10px; /* 열 간의 간격 추가 */
}

.menu-item {
  padding: 10px 0;
  cursor: pointer;
}


.menu-item:last-child {
  border-bottom: none;
}

.close-button {
  cursor: pointer; /* 마우스 포인터가 아이템에 올 때 손가락 모양으로 변경 */
  margin-left: auto; /* 제목과의 간격을 자동으로 설정하여 오른쪽 끝으로 이동 */
}

.close-button img {
  width: 24px; /* 이미지 크기 조정 (조정 가능) */
  height: 24px; /* 이미지 크기 조정 (조정 가능) */
}
</style>