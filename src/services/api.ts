// API服务封装
const API_BASE_URL = 'https://neteasecloudmusicapienhanced.js.org'

// 搜索音乐
export const searchMusic = async (keywords: string, limit: number = 30, offset: number = 0) => {
  try {
    const response = await fetch(`${API_BASE_URL}/search?keywords=${encodeURIComponent(keywords)}&limit=${limit}&offset=${offset}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('搜索音乐失败:', error)
    throw error
  }
}

// 获取歌曲详情
export const getSongDetail = async (ids: number | number[]) => {
  try {
    const idsParam = Array.isArray(ids) ? ids.join(',') : ids
    const response = await fetch(`${API_BASE_URL}/song/detail?ids=${idsParam}`)
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
    const response = await fetch(`${API_BASE_URL}/song/url?id=${id}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('获取歌曲播放链接失败:', error)
    throw error
  }
}

// 获取歌词
export const getLyric = async (id: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/lyric?id=${id}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('获取歌词失败:', error)
    throw error
  }
}