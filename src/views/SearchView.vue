<template>
  <div class="search-view" style="padding: 20px;">
    <n-card v-if="musicStore.searchResults.length > 0">
      <template #header>
        <h3>搜索结果: "{{ musicStore.searchKeywords }}"</h3>
      </template>
      <SongList 
        :songs="musicStore.searchResults" 
        @play="handlePlay"
      />
    </n-card>
    
    <n-empty 
      v-else-if="musicStore.searchKeywords && !musicStore.searchLoading && !initialLoading" 
      description="未找到相关音乐" 
      style="padding: 40px;"
    >
      <template #extra>
        <n-button @click="clearSearch">清除搜索</n-button>
      </template>
    </n-empty>
    
    <n-spin 
      v-else-if="musicStore.searchLoading || initialLoading" 
      size="large" 
      style="text-align: center; padding: 40px;"
    />
  </div>
</template>

<script setup lang="ts">
import { useMusicStore } from '@/stores/musicStore'
import SongList from '@/components/SongList.vue'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const musicStore = useMusicStore()
const route = useRoute()
const router = useRouter()
const initialLoading = ref(true)

// 处理播放事件
const handlePlay = async (songId: number) => {
  await musicStore.playSongById(songId)
}

// 清除搜索
const clearSearch = () => {
  musicStore.clearSearchResults()
  router.push('/search')
}

// 执行搜索
const performSearch = async (keywords: string) => {
  if (keywords) {
    initialLoading.value = true
    try {
      await musicStore.searchSongs(decodeURIComponent(keywords))
    } finally {
      initialLoading.value = false
    }
  } else {
    initialLoading.value = false
  }
}

// 监听路由查询参数变化
watch(
  () => route.query.q,
  (newQuery) => {
    performSearch(newQuery as string)
  },
  { immediate: true }
)
</script>