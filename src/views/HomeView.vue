<template>
  <div class="home" style="height: 100vh;">
    <n-layout style="height: 100%;">
      <!-- 顶部导航栏 -->
      <n-layout-header bordered style="height: 70px;">
        <div style="display: flex; align-items: center; height: 100%; padding: 0 20px;">
          <div style="margin-right: 30px;">
            <h2>MusicJoy</h2>
          </div>
          
          <div style="margin: 0 20px;flex: 1;">
            <n-input 
              placeholder="搜索音乐" 
              style="width: 300px" 
              v-model:value="searchKeywords"
              @keyup.enter="handleSearch"
            >
              <template #suffix>
                <n-button text @click="handleSearch">
                  <GlobalIcon name="Search" :size="24" />
                </n-button>
              </template>
            </n-input>
          </div>
          
          <div style="margin-left: 20px;">
            <n-avatar round size="small" />
          </div>
        </div>
      </n-layout-header>
      
      <!-- 主内容区 -->
      <n-layout has-sider style="height: calc(100% - 140px);">
        <!-- 侧边栏 -->
        <n-layout-sider 
          bordered 
          width="200"
        >
          <div style="padding: 20px 0;">
            <n-menu :options="navOptions" />
          </div>
        </n-layout-sider>
        
        <!-- 主内容 -->
        <n-layout-content style="padding: 20px;">
          <router-view />
        </n-layout-content>
      </n-layout>
      
      <!-- 底部播放栏 -->
      <n-layout-footer bordered style="height: 70px;">
        <div @click="goToPlayerDetail" style="display: flex; align-items: center; justify-content: space-between; height: 100%; padding: 0 20px; cursor: pointer;">
          <div style="display: flex; align-items: center; width: 200px;">
            <n-avatar round size="small" :src="musicStore.playSong.cover" />
            <div style="margin-left: 10px;">
              <div>{{ musicStore.playSong.name || '暂无播放' }}</div>
            </div>
          </div>
          
          <div style="flex: 1; display: flex; justify-content: center;">
            <n-space>
              <n-button circle quaternary @click.stop="playPrev">
                <template #icon>
                  <GlobalIcon name="SkipPrev" :size="24" />
                </template>
              </n-button>
              <n-button circle type="primary" @click.stop="togglePlay">
                <template #icon>
                  <GlobalIcon v-if="musicStore.isPlaying" name="Pause" :size="24" />
                  <GlobalIcon v-else name="Play" :size="24" />
                </template>
              </n-button>
              <n-button circle quaternary @click.stop="playNext">
                <template #icon>
                  <GlobalIcon name="SkipNext" :size="24" />
                </template>
              </n-button>
            </n-space>
          </div>
          
          <div style="width: 200px; display: flex; justify-content: flex-end;">
            <n-slider :step="1" style="width: 100px" :value="musicStore.volume" @update:value="setVolume" />
          </div>
        </div>
      </n-layout-footer>
    </n-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { MenuOption } from 'naive-ui'
import { useRouter } from 'vue-router'
import { useMusicStore } from '@/stores/musicStore'
import { storeToRefs } from 'pinia'

const router = useRouter()
const musicStore = useMusicStore()

// 搜索相关
const searchKeywords = ref('')

const activeKey = ref<string>('discover')

const navOptions: MenuOption[] = [
  {
    label: '发现音乐',
    key: 'discover',
  },
  {
    label: '我的音乐',
    key: 'my',
  },
]

const goToPlayerDetail = () => {
  router.push('/player')
}

// 处理搜索
const handleSearch = async () => {
  if (searchKeywords.value.trim()) {
    await musicStore.searchSongs(searchKeywords.value)
    // 跳转到搜索页面，携带搜索关键词作为查询参数
    router.push(`/search?q=${encodeURIComponent(searchKeywords.value)}`)
  }
}

// 切换播放/暂停
const togglePlay = () => {
  musicStore.togglePlay()
}

// 播放上一首
const playPrev = () => {
  // 这里可以实现播放上一首的逻辑
  console.log('播放上一首')
}

// 播放下一首
const playNext = () => {
  // 这里可以实现播放下一首的逻辑
  console.log('播放下一首')
}

// 设置音量
const setVolume = (volume: number) => {
  musicStore.setVolume(volume)
}

// 组件挂载时检查是否有搜索关键词
onMounted(() => {
  if (musicStore.searchKeywords) {
    searchKeywords.value = musicStore.searchKeywords
  }
})
</script>