import { defineStore } from "pinia";

export const useLoginModalStore = defineStore("loginModal", {
    state: () => ({
        modalStatus: false, // 모달 상태
        redirectPath: null, // 리다이렉션 경로
    }),
    actions: {
        openModal(path) {
            this.modalStatus = true;
            this.redirectPath = path;
        },
        closeModal() {
            this.modalStatus = false;
            this.redirectPath = null;
        },
    },
});
