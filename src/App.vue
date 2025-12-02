<template>
  <Provider>
    <RouterView />
  </Provider>
</template>

<script setup lang="ts">
import Provider from './components/global/Provider.vue'
import { defineAsyncComponent } from 'vue'

// 动态导入全局图标组件
const GlobalIcon = defineAsyncComponent(() => import('./components/global/GlobalIcon.vue'))

// 注册全局组件
import { getCurrentInstance } from 'vue'
const instance = getCurrentInstance()
if (instance) {
  instance.appContext.app.component('GlobalIcon', GlobalIcon)
}
</script>