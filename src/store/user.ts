import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        token: '',
        userInfo: null as null | { id: string; name: string },
    }),
    actions: {
        setToken(t: string) {
            this.token = t
        },
        setUserInfo(info: { id: string; name: string }) {
            this.userInfo = info
        },
    },
})
