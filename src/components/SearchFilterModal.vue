<script>
import { computed } from "vue";
import { SEARCH_FILTER_TYPES } from "@/constants/searchFilterTypes";
import { useRegionsStore } from "@/stores/useRegionsStore";
import { useJobStore } from "@/stores/useJobStore";

export default {
  name: "SearchFilterModal",
  computed: {
    SEARCH_FILTER_TYPES() {
      return SEARCH_FILTER_TYPES;
    },
  },
  props: {
    filterType: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const regionsStore = useRegionsStore();
    const jobStore = useJobStore();

    // 지역 리스트 설정
    const provinces = computed(() => {
      const originalProvinces = regionsStore.getProvinces;
      return ["전체 지역", ...originalProvinces];
    });

    // 직무 리스트 설정
    const jobs = computed(() => {
      const originalJobs = jobStore.getJobs;
      console.log("originalJobs:", originalJobs);
      return ["전체 직무", ...originalJobs.map((job) => job.jobName)];
    });

    // 경고 필터링 리스트
    const warnings = ['많은 순','적은 순','없음',];

    const selectedFilterType = computed(() => props.filterType);

    const closeModal = () => {
      emit("close-modal", false);
    };

    const halfLengthProvinces = Math.ceil(provinces.value.length / 2);
    const leftProvinces = computed(() => provinces.value.slice(0, halfLengthProvinces));
    const rightProvinces = computed(() => provinces.value.slice(halfLengthProvinces));

    const halfLengthJobs = Math.ceil(jobs.value.length / 2);
    const leftJobs = computed(() => jobs.value.slice(0, halfLengthJobs));
    const rightJobs = computed(() => jobs.value.slice(halfLengthJobs));

    const selectFilter = (filterValue) => {
      emit("select-filter", {
        filterType: selectedFilterType.value,
        filterValue: filterValue,
      });
      closeModal();
    };

    return {
      closeModal,
      selectFilter,
      selectedFilterType,
      leftProvinces,
      rightProvinces,
      leftJobs,
      rightJobs,
      warnings,
    };
  },
};
</script>

<template>
  <div class="modal-overlay">
    <div class="menu-content job" v-if="selectedFilterType === SEARCH_FILTER_TYPES.JOB">
      <div class="menu_title">
        직무
        <div class="close-button" @click="closeModal">
          <img src="@/assets/images/icons/close.png" alt="Close" />
        </div>
      </div>
      <div class="menu-items job">
        <div class="menu-column">
          <div
              class="menu-item"
              v-for="(job, index) in leftJobs"
              :key="index"
              @click="selectFilter(job)"
          >
            {{ job }}
          </div>
        </div>
        <div class="menu-column">
          <div
              class="menu-item"
              v-for="(job, index) in rightJobs"
              :key="index"
              @click="selectFilter(job)"
          >
            {{ job }}
          </div>
        </div>
      </div>
    </div>

    <div class="menu-content region" v-if="selectedFilterType === SEARCH_FILTER_TYPES.REGIONS">
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
              @click="selectFilter(province)"
          >
            {{ province }}
          </div>
        </div>
        <div class="menu-column">
          <div
              class="menu-item"
              v-for="(province, index) in rightProvinces"
              :key="index"
              @click="selectFilter(province)"
          >
            {{ province }}
          </div>
        </div>
      </div>
    </div>
    <div class="menu-content region" v-if="selectedFilterType === SEARCH_FILTER_TYPES.WARNING">
      <div class="menu_title">
        경고 필터링
        <div class="close-button" @click="closeModal">
          <img src="@/assets/images/icons/close.png" alt="Close" />
        </div>
      </div>
      <div class="menu-items">
        <div class="menu-column">
          <div
              class="menu-item"
              v-for="(warning, index) in warnings"
              :key="index"
              @click="selectFilter(warning)"
          >
            {{ warning }}
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
  margin-bottom: 0;
}

.menu-content .job{
  height: 85%;
}

.menu-content .region{
  height: 70%;
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