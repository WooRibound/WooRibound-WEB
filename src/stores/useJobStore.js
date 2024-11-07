import { defineStore } from 'pinia';
import {fetchJobs} from "@/api/services/globalServiece";

export const useJobStore = defineStore('jobStore', {
    state: () => ({
        jobs: [],
    }),
    getters: {
        getJobs(state) {
            return state.jobs;
        },
    },
    actions: {
        async fetchJobs() {
            if (this.jobs.length > 0) return; // 이미 데이터가 있으면 API 호출 생략
            try {
                const data = await fetchJobs();
                this.jobs = data.data;
            } catch (error) {
                console.error('Error fetching jobs:', error);
                throw error;
            }
        },
    },
});
