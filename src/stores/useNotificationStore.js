import {defineStore} from "pinia";
import {fetchAllNotification} from "@/api/services/individualUserService";
import {useUserStore} from "@/stores/userStore";

export const useNotificationStore = defineStore('notification', {
    state: () => ({
        count: 0,
    }),
    getters: {
        getCount(state) {
            return state.count;
        },
    },
    actions: {
        async fetchAllNotification() {
            const userStore = useUserStore();

            if (!userStore.isLoggedIn) {
                return;
            }

            try {
                const notifications = await fetchAllNotification();
                const confirmedCount = notifications.filter(notification => notification.isConfirmed === "N").length;

                this.count = confirmedCount;
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            }

        },
    },
});