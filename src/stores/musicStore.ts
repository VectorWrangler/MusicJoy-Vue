import type { SongLyric } from "@/types/lyric";
import type { SongType } from "@/types/main"
import { defineStore } from "pinia"
import { searchMusic, SearchType, playSong, parseSearchResult } from "@/services/musicApi"
import { Howl } from 'howler'

interface MusicState {
  playSong: SongType;
  playPlaylistId: number;
  songLyric: SongLyric
  personalFM: {
    playIndex: number;
    list: SongType[];
  };
  dailySongsData: {
    timestamp: number | null;
    list: SongType[];
  };
  // 搜索相关状态
  searchResults: SongType[];
  searchLoading: boolean;
  searchKeywords: string;
  // 播放器状态
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
}

// 默认音乐数据
const defaultMusicData: SongType = {
  id: 0,
  name: "未播放歌曲",
  artists: "未知歌手",
  album: "未知专辑",
  cover: "/images/song.jpg?assest",
  duration: 0,
  free: 0,
  mv: null,
  type: "song",
};

export const useMusicStore = defineStore("music", {
  state: (): MusicState => ({
    // 当前播放歌曲
    playSong: { ...defaultMusicData },
    // 当前播放歌单
    playPlaylistId: 0,
    // 当前歌曲歌词
    songLyric: {
      lrcData: [], // 普通歌词
      yrcData: [], // 逐字歌词
    },
    // 私人FM数据
    personalFM: {
      playIndex: 0,
      list: [],
    },
    // 每日推荐
    dailySongsData: {
      timestamp: null, // 更新时间
      list: [], // 歌曲数据
    },
    // 搜索相关状态
    searchResults: [],
    searchLoading: false,
    searchKeywords: "",
    // 播放器状态
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 80,
  }),

  getters: {
    // 是否具有歌词
    isHasLrc(state): boolean {
      return state.songLyric.lrcData.length > 0 && state.playSong.type !== "radio";
    },
    // 是否具有逐字歌词
    isHasYrc(state): boolean {
      return state.songLyric.yrcData.length > 0;
    },
    // 是否有播放器
    isHasPlayer(state): boolean {
      return state.playSong?.id !== 0;
    },
    // 歌曲封面
    songCover(state): string {
      return state.playSong.path
        ? state.playSong.cover
        : state.playSong.coverSize?.s || state.playSong.cover;
    },
    // 私人FM播放歌曲
    personalFMSong(state): SongType {
      return state.personalFM.list?.[state.personalFM.playIndex] || defaultMusicData;
    },
  },

  actions: {
    /** 重置音乐数据 */
    resetMusicData() {
      this.playSong = { ...defaultMusicData };
      this.songLyric = { lrcData: [], yrcData: [] };
    },
    /**
     * 设置/更新歌曲歌词数据
     * @param updates 部分或完整歌词数据
     * @param replace 是否覆盖（true：用提供的数据覆盖并为缺省字段置空；false：合并更新）
     */
    setSongLyric(updates: Partial<SongLyric>, replace: boolean = false) {
      if (replace) {
        this.songLyric = {
          lrcData: updates.lrcData ?? [],
          yrcData: updates.yrcData ?? [],
        };
      } else {
        this.songLyric = {
          lrcData: updates.lrcData ?? this.songLyric.lrcData,
          yrcData: updates.yrcData ?? this.songLyric.yrcData,
        };
      }
    },
    // 获取歌曲封面
    getSongCover(size: "s" | "m" | "l" | "xl" | "cover" = "s") {
      return this.playSong.path
        ? this.playSong.cover
        : size === "cover"
          ? this.playSong.cover
          : this.playSong.coverSize?.[size] || this.playSong.cover;
    },
    
    // 搜索音乐
    async searchSongs(keywords: string, limit: number = 30, offset: number = 0) {
      if (!keywords.trim()) return;
      
      this.searchLoading = true;
      this.searchKeywords = keywords;
      
      try {
        const response = await searchMusic(keywords, SearchType.SONG, limit, offset);
        console.log('搜索API响应:', response); // 用于调试
        // 使用 services 层的解析函数处理搜索结果
        this.searchResults = parseSearchResult(response);
      } catch (error) {
        console.error("搜索失败:", error);
        this.searchResults = [];
      } finally {
        this.searchLoading = false;
      }
    },
    
    // 播放指定歌曲
    async playSongById(songId: number) {
      try {
        const result = await playSong(songId)
        
        // 更新当前播放歌曲
        this.playSong = {
          id: result.song.id,
          name: result.song.name,
          artists: result.song.ar?.map((artist: any) => artist.name).join(",") || "未知歌手",
          album: result.song.al?.name || "未知专辑",
          cover: result.song.al?.picUrl || "/images/song.jpg?assest",
          duration: result.song.dt || 0,
          free: result.song.fee || 0,
          mv: result.song.mv || null,
          type: "song",
        }
        
        // 更新歌词
        if (result.lyric) {
          this.setSongLyric(result.lyric, true)
        }
        
        // 设置播放器状态
        this.isPlaying = true
        this.currentTime = 0
        this.duration = result.song.dt || 0
        
        // 触发实际播放
        this.playAudio(result.url.url)
      } catch (error) {
        console.error("播放歌曲失败:", error)
        window.$message?.error("播放歌曲失败")
      }
    },
    
    // 实际播放音频
    playAudio(url: string) {
      // 停止当前播放
      if (window.player) {
        window.player.stop();
        window.player.unload();
      }
      
      // 动态导入 Howler.js
      import('howler').then(({ Howl }) => {
        // 创建新的播放器实例
        window.player = new Howl({
          src: [url],
          html5: true,
          volume: this.volume / 100,
          onplay: () => {
            this.isPlaying = true;
            this.updateProgress();
          },
          onpause: () => {
            this.isPlaying = false;
          },
          onstop: () => {
            this.isPlaying = false;
            this.currentTime = 0;
          },
          onend: () => {
            this.isPlaying = false;
            this.currentTime = 0;
          },
          onloaderror: (id: any, error: any) => {
            console.error("音频加载失败:", error);
            window.$message?.error("音频加载失败");
          },
          onplayerror: (id: any, error: any) => {
            console.error("音频播放失败:", error);
            window.$message?.error("音频播放失败");
          }
        }) as any;
        
        // 开始播放
        if (window.player) {
          window.player.play();
        }
      });
    },
    
    // 更新播放进度
    updateProgress() {
      if (window.player && this.isPlaying) {
        this.currentTime = window.player.seek() * 1000; // 转换为毫秒
        
        if (this.isPlaying) {
          setTimeout(() => this.updateProgress(), 1000);
        }
      }
    },
    
    // 切换播放/暂停
    togglePlay() {
      if (!window.player) return;
      
      if (this.isPlaying) {
        window.player.pause();
        this.isPlaying = false;
      } else {
        window.player.play();
        this.isPlaying = true;
        this.updateProgress();
      }
    },
    
    // 设置音量
    setVolume(volume: number) {
      this.volume = volume;
      if (window.player) {
        window.player.volume(volume / 100);
      }
    },
    
    // 设置播放进度
    seek(time: number) {
      if (window.player) {
        window.player.seek(time / 1000); // Howler.js 使用秒为单位
        this.currentTime = time;
      }
    },
    
    // 清空搜索结果
    clearSearchResults() {
      this.searchResults = [];
      this.searchKeywords = "";
    }
  },
});