import { defineStore } from 'pinia'

export const useSettingStore = defineStore('setting', {
  state: () => ({
    themeMode: 'dark' as 'light' | 'dark' | 'auto',
    themeColorType: 'default' as string,
    themeFollowCover: false,
    themeGlobalColor: false,
    globalFont: 'default' as string,
    themeCustomColor: '' as string,
  }),
  
  actions: {
    setThemeMode(mode: 'light' | 'dark' | 'auto') {
      this.themeMode = mode
    },
    
    setThemeColorType(type: string) {
      this.themeColorType = type
    },
    
    toggleThemeFollowCover() {
      this.themeFollowCover = !this.themeFollowCover
    },
    
    toggleThemeGlobalColor() {
      this.themeGlobalColor = !this.themeGlobalColor
    },
    
    setGlobalFont(font: string) {
      this.globalFont = font
    },
    
    setThemeCustomColor(color: string) {
      this.themeCustomColor = color
    }
  }
})