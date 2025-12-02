<template>
  <div class="icon-test" style="padding: 20px;">
    <h2>全局图标组件测试</h2>
    
    <div style="display: flex; gap: 20px; flex-wrap: wrap;">
      <div style="text-align: center;">
        <GlobalIcon name="Play" :size="48" />
        <p>Play</p>
      </div>
      
      <div style="text-align: center;">
        <GlobalIcon name="Pause" :size="48" />
        <p>Pause</p>
      </div>
      
      <div style="text-align: center;">
        <GlobalIcon name="SkipPrev" :size="48" />
        <p>SkipPrev</p>
      </div>
      
      <div style="text-align: center;">
        <GlobalIcon name="SkipNext" :size="48" />
        <p>SkipNext</p>
      </div>
      
      <div style="text-align: center;">
        <GlobalIcon name="Search" :size="48" />
        <p>Search</p>
      </div>
      
      <div style="text-align: center;">
        <GlobalIcon name="VolumeUp" :size="48" />
        <p>VolumeUp</p>
      </div>
      
      <div style="text-align: center;">
        <GlobalIcon name="Shuffle" :size="48" />
        <p>Shuffle</p>
      </div>
      
      <div style="text-align: center;">
        <GlobalIcon name="Repeat" :size="48" />
        <p>Repeat</p>
      </div>
      
      <div style="text-align: center;">
        <GlobalIcon name="ArrowBack" :size="48" />
        <p>ArrowBack</p>
      </div>
    </div>
    
    <div style="margin-top: 30px;">
      <h3>动态图标测试</h3>
      <n-input v-model:value="iconName" placeholder="输入图标名称" style="width: 300px; margin-right: 20px;" />
      <GlobalIcon :name="iconName" :size="48" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const iconName = ref('Play')
</script>