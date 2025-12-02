<template>
  <div class="player-detail">
    <n-layout style="height: 100vh;">
      <!-- 顶部导航 -->
      <n-layout-header bordered style="height: 70px; display: flex; align-items: center; padding: 0 20px;">
        <n-button circle quaternary @click="goBack">
          <template #icon>
            <GlobalIcon name="ArrowBack" :size="24" />
          </template>
        </n-button>
        <div style="margin-left: 20px;">
          <h2>正在播放</h2>
        </div>
      </n-layout-header>
      
      <!-- 主内容区 -->
      <n-layout-content style="padding: 20px; display: flex; flex-direction: column; align-items: center;">
        <!-- 专辑封面 -->
        <div class="album-cover" style="width: 300px; height: 300px; margin: 40px 0;">
          <n-avatar round :size="300" :src="currentSong.cover" />
        </div>
        
        <!-- 歌曲信息 -->
        <div class="song-info" style="text-align: center; margin-bottom: 40px;">
          <h2>{{ currentSong.name }}</h2>
          <p>{{ currentSong.artists }} - {{ currentSong.album }}</p>
        </div>
        
        <!-- 歌词展示 -->
        <div class="lyrics-container" style="width: 100%; max-width: 500px; height: 200px; margin-bottom: 20px; overflow: hidden;">
          <LyricPlayer
            v-if="lyricLines.length > 0"
            :lyric-lines="lyricLines"
            :current-time="currentTime"
            :disabled="false"
            :playing="isPlaying"
            :align-position="0.5"
            :enable-spring="true"
            :enable-blur="true"
            :enable-scale="true"
            style="height: 200px;"
          />
          <div v-else style="display: flex; align-items: center; justify-content: center; height: 100%; color: #999;">
            暂无歌词
          </div>
        </div>
        
        <!-- 进度条 -->
        <div class="progress" style="width: 100%; max-width: 500px; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>{{ formatCurrentTime(currentTime) }}</span>
            <span>{{ formatDuration(currentSong.duration) }}</span>
          </div>
          <n-slider 
            :step="1" 
            :min="0" 
            :max="currentSong.duration" 
            :value="currentTime"
            :format-tooltip="(value) => formatCurrentTime(value)"
            @update:value="handleSeek"
          />
        </div>
        
        <!-- 控制按钮 -->
        <div class="controls" style="margin: 30px 0;">
          <n-space>
            <n-button circle quaternary size="large">
              <template #icon>
                <GlobalIcon name="Shuffle" :size="24" />
              </template>
            </n-button>
            <n-button circle type="primary" size="large" @click="togglePlay">
              <template #icon>
                <GlobalIcon v-if="isPlaying" name="Pause" :size="24" />
                <GlobalIcon v-else name="Play" :size="24" />
              </template>
            </n-button>
            <n-button circle quaternary size="large">
              <template #icon>
                <GlobalIcon name="Repeat" :size="24" />
              </template>
            </n-button>
          </n-space>
        </div>
        
        <!-- 音量控制和其他操作 -->
        <div class="actions" style="width: 100%; max-width: 500px; display: flex; justify-content: space-between; align-items: center;">
          <n-button circle quaternary>
            <template #icon>
              <GlobalIcon name="VolumeUp" :size="24" />
            </template>
          </n-button>
          
          <n-slider :step="1" style="width: 100px;" :value="volume" @update:value="handleVolumeChange" />
        </div>
      </n-layout-content>
    </n-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMusicStore } from '@/stores/musicStore'
import { storeToRefs } from 'pinia'
import { LyricPlayer } from '@applemusic-like-lyrics/vue'

const router = useRouter()
const musicStore = useMusicStore()
const { playSong: currentSong, isPlaying, currentTime, volume, songLyric } = storeToRefs(musicStore)

// 歌词行数据
const lyricLines = computed(() => {
  // 优先使用逐字歌词
  if (songLyric.value.yrcData && songLyric.value.yrcData.length > 0) {
    return songLyric.value.yrcData
  }
  // 回退到普通歌词
  else if (songLyric.value.lrcData && songLyric.value.lrcData.length > 0) {
    return songLyric.value.lrcData
  }
  // 没有歌词
  else {
    return []
  }
})

const goBack = () => {
  router.back()
}

// 切换播放/暂停
const togglePlay = () => {
  musicStore.togglePlay()
}

// 处理音量变化
const handleVolumeChange = (value: number) => {
  musicStore.setVolume(value)
}

// 处理进度条拖动
const handleSeek = (value: number) => {
  musicStore.seek(value)
}

// 格式化时长
const formatDuration = (milliseconds: number) => {
  if (!milliseconds) return '0:00'
  const totalSeconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// 格式化当前时间
const formatCurrentTime = (milliseconds: number) => {
  if (!milliseconds) return '0:00'
  const totalSeconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
</script>