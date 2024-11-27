import { defineStore } from 'pinia';

export const useSubscriptionStore = defineStore('subscription', {
    state: () => ({
        isSubscribed: false, // 구독 여부
        subscriptionType: null, // 구독 타입 (month, year, 또는 null)
    }),
    getters: {
        subscriptionStatus(state) {
            return state.isSubscribed ? '구독 중' : '미구독';
        },
        subscriptionDetails(state) {
            if (!state.isSubscribed) return '미구독 상태';
            return state.subscriptionType === 'year'
                ? '1년 구독'
                : state.subscriptionType === 'month'
                    ? '월 구독'
                    : '구독 타입 미지정';
        },
    },
    actions: {
        setSubscriptionStatus(status) {
            this.isSubscribed = status;
        },
        toggleSubscription() {
            this.isSubscribed = !this.isSubscribed;
        },
        setSubscriptionType(type) {
            if (type !== 'month' && type !== 'year') {
                throw new Error('유효하지 않은 구독 타입입니다. "month" 또는 "year"만 허용됩니다.');
            }
            this.subscriptionType = type;
        },
        clearSubscription() {
            this.isSubscribed = false;
            this.subscriptionType = null;
        },
    },
});
