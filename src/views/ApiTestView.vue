<template>
  <div style="padding: 20px;">
    <h2>API 测试</h2>
    <n-input v-model:value="searchKeyword" placeholder="输入搜索关键词" style="width: 300px; margin-right: 20px;" />
    <n-button @click="testSearch">测试搜索</n-button>
    
    <div v-if="searchResult" style="margin-top: 20px;">
      <h3>搜索结果:</h3>
      <pre>{{ JSON.stringify(searchResult, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { searchMusic, SearchType } from '@/services/musicApi'

const searchKeyword = ref('')
const searchResult = ref<any>(null)

const testSearch = async () => {
  if (searchKeyword.value.trim()) {
    try {
      const result = await searchMusic(searchKeyword.value, SearchType.SONG, 5)
      searchResult.value = result
      console.log('搜索结果:', result)
    } catch (error) {
      console.error('搜索失败:', error)
    }
  }
}
</script>