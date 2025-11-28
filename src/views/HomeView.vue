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
            <n-input placeholder="搜索音乐" style="width: 200px" />
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
          <!-- 内容区域 -->
          <div style="height: 100%;">
            <router-view />
          </div>
        </n-layout-content>
      </n-layout>
      
      <!-- 底部播放栏 -->
      <n-layout-footer bordered style="height: 70px;">
        <div style="display: flex; align-items: center; justify-content: space-between; height: 100%; padding: 0 20px;">
          <div style="display: flex; align-items: center; width: 200px;">
            <n-avatar round size="small" />
            <div style="margin-left: 10px;">
              <div>暂无播放</div>
            </div>
          </div>
          
          <div style="flex: 1; display: flex; justify-content: center;">
            <n-space>
              <n-button circle quaternary>
                <template #icon>
                  <n-icon>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                    </svg>
                  </n-icon>
                </template>
              </n-button>
              <n-button circle type="primary">
                <template #icon>
                  <n-icon>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </n-icon>
                </template>
              </n-button>
              <n-button circle quaternary>
                <template #icon>
                  <n-icon>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                    </svg>
                  </n-icon>
                </template>
              </n-button>
            </n-space>
          </div>
          
          <div style="width: 200px; display: flex; justify-content: flex-end;">
            <n-slider :step="1" style="width: 100px" />
          </div>
        </div>
      </n-layout-footer>
    </n-layout>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { MenuOption } from 'naive-ui'

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
</script>