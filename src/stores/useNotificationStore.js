import { defineStore } from "pinia";
import { fetchAllNotification } from "@/api/services/individualUserService";
import { useUserStore } from "@/stores/userStore";

export const useNotificationStore = defineStore('notification', {
    state: () => ({
        count: 0,
        notifications: [],
    }),
    getters: {
        getCount(state) {
            return state.count;
        },
        getNotifications(state) {
            return state.notifications;
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
                this.notifications = notifications;

                const confirmedCount = notifications.filter(notification => notification.isConfirmed === "N").length;
                this.count = confirmedCount;
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            }
        },
    },
});
