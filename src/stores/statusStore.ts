import { defineStore } from 'pinia'

export const useStatusStore = defineStore('status', {
  state: () => ({
    songCoverTheme: null as { main: string; light: string; dark: string } | null,
    // 其他状态...
  }),
  
  actions: {
    setSongCoverTheme(theme: { main: string; light: string; dark: string } | null) {
      this.songCoverTheme = theme
    }
  }
})