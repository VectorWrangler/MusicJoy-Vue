// 音乐API服务
// 基于NeteaseCloudMusicApiEnhanced文档实现

// 默认API基础URL（根据实际部署情况修改）
const API_BASE_URL = 'http://localhost:3000' // 使用本地后端服务

// 搜索类型枚举
export enum SearchType {
  SONG = 1,      // 单曲
  ALBUM = 10,    // 专辑
  ARTIST = 100,  // 歌手
  PLAYLIST = 1000, // 歌单
  USER = 1002,   // 用户
  MV = 1004,     // MV
  LYRIC = 1006,  // 歌词
  RADIO = 1009   // 电台
}

// 搜索音乐 (使用 cloudsearch 接口)
export const searchMusic = async (
  keywords: string, 
  type: SearchType = SearchType.SONG, 
  limit: number = 30, 
  offset: number = 0
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/cloudsearch?keywords=${encodeURIComponent(keywords)}&type=${type}&limit=${limit}&offset=${offset}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('搜索音乐失败:', error)
    throw error
  }
}

// 解析搜索结果
export const parseSearchResult = (response: any) => {
  if (!response.result || !response.result.songs) {
    return []
  }
  
  return response.result.songs.map((song: any) => {
    return {
      id: song.id,
      name: song.name,
      artists: song.ar?.map((artist: any) => artist.name).join(",") || "未知歌手",
      album: song.al?.name || "未知专辑",
      cover: song.al?.picUrl || "/images/song.jpg?assest",
      duration: song.dt || 0,
      free: song.fee || 0,
      mv: song.mv || null,
      type: "song",
    }
  })
}

// 获取歌曲详情
export const getSongDetail = async (ids: number | number[]) => {
  try {
    const idsParam = Array.isArray(ids) ? ids.join(',') : ids
    const response = await fetch(`${API_BASE_URL}/song/detail?ids=${idsParam}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('获取歌曲详情失败:', error)
    throw error
  }
}

// 获取歌曲播放链接
export const getSongUrl = async (id: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/song/url?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('获取歌曲播放链接失败:', error)
    throw error
  }
}

// 获取歌词 (包括逐字歌词)
export const getLyric = async (id: number) => {
  try {
    // 首先尝试获取新版歌词（包含逐字歌词）
    let response = await fetch(`${API_BASE_URL}/lyric/new?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    // 如果新版接口失败，回退到旧版接口
    if (!response.ok) {
      response = await fetch(`${API_BASE_URL}/lyric?id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('获取歌词失败:', error)
    throw error
  }
}

// 解析歌词数据
export const parseLyric = (lyricData: any) => {
  const result = {
    lrcData: [] as any[],
    yrcData: [] as any[]
  }
  
  // 解析普通歌词
  if (lyricData.lrc?.lyric) {
    result.lrcData = parseLyricText(lyricData.lrc.lyric)
  }
  
  // 解析逐字歌词
  if (lyricData.yrc?.lyric) {
    result.yrcData = parseYrcLyric(lyricData.yrc.lyric)
  }
  
  return result
}

// 解析普通歌词文本
const parseLyricText = (lyricText: string) => {
  const lines = lyricText.split('\n')
  const parsedLines: any[] = []
  
  for (const line of lines) {
    const match = line.match(/\[(\d+):(\d+\.\d+)\](.*)/)
    if (match && match[1] && match[2]) {
      const minutes = parseInt(match[1])
      const seconds = parseFloat(match[2])
      const text = match[3] || ''
      const time = Math.round((minutes * 60 + seconds) * 1000)
      
      parsedLines.push({
        time,
        text
      })
    }
  }
  
  return parsedLines
}

// 解析逐字歌词
const parseYrcLyric = (yrcText: string) => {
  const lines = yrcText.split('\n')
  const parsedLines: any[] = []
  
  for (const line of lines) {
    // 匹逐字歌词格式 [开始时间,总时长](逐字时间,持续时间,未知)文字...
    const timeMatch = line.match(/\[(\d+),(\d+)\]/)
    if (timeMatch && timeMatch[1] && timeMatch[2]) {
      const startTime = parseInt(timeMatch[1])
      const totalTime = parseInt(timeMatch[2])
      const textMatch = line.match(/\)([^(\[\])]*)$/)
      
      if (textMatch) {
        const text = textMatch[1] || ''
        parsedLines.push({
          time: startTime,
          text,
          duration: totalTime
        })
      }
    }
  }
  
  return parsedLines
}

// 播放歌曲
export const playSong = async (songId: number) => {
  try {
    // 获取歌曲详情
    const detailResponse = await getSongDetail(songId)
    if (!detailResponse.songs || detailResponse.songs.length === 0) {
      throw new Error('未找到歌曲详情')
    }
    
    // 获取播放链接
    const urlResponse = await getSongUrl(songId)
    if (!urlResponse.data || urlResponse.data.length === 0) {
      throw new Error('未找到播放链接')
    }
    
    // 获取歌词
    const lyricResponse = await getLyric(songId)
    
    // 解析歌词
    const parsedLyric = parseLyric(lyricResponse)
    
    return {
      song: detailResponse.songs[0],
      url: urlResponse.data[0],
      lyric: parsedLyric
    }
  } catch (error) {
    console.error('播放歌曲失败:', error)
    throw error
  }
}