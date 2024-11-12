import { defineStore } from "pinia";

export const useIndustriesStore = defineStore("industry", {
  state: () => ({
    industries: [
      "제조업",
      "요식업",
      "IT",
      "금융업",
      "서비스업",
      "건설업",
      "운수업",
      "농업/어업",
      "제약/생명과학",
      "교육업",
      "의료업",
      "예술/문화",
      "관광/레저",
      "의류",
      "기타",
    ],
  }),
  getters: {
    getIndustries(state) {
      return state.industries;
    },
  },
});
