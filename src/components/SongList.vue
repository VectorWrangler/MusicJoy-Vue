<template>
  <div class="song-list">
    <n-list>
      <n-list-item v-for="song in songs" :key="song.id">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center;">
            <n-avatar
              round
              :size="40"
              :src="song.cover"
              style="margin-right: 15px;"
            />
            <div>
              <div>{{ song.name }}</div>
              <div style="font-size: 12px; opacity: 0.7;">{{ song.artists }} - {{ song.album }}</div>
            </div>
          </div>
          <div style="display: flex; align-items: center;">
            <span style="margin-right: 15px; font-size: 12px; opacity: 0.7;">
              {{ formatDuration(song.duration) }}
            </span>
            <n-button circle @click="onPlay(song.id)">
              <template #icon>
                <GlobalIcon name="Play" :size="24" />
              </template>
            </n-button>
          </div>
        </div>
      </n-list-item>
    </n-list>
  </div>
</template>

<script setup lang="ts">
import type { SongType } from '@/types/main'

const props = defineProps<{
  songs: SongType[]
}>()

const emit = defineEmits<{
  (e: 'play', songId: number): void
}>()

// 播放歌曲
const onPlay = (songId: number) => {
  emit('play', songId)
}

// 格式化时长
const formatDuration = (milliseconds: number) => {
  if (!milliseconds) return '0:00'
  const totalSeconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
</script>