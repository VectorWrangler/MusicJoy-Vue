export type MetaData = {
    id: number
    name: string
    cover?: string
    alias?: string[]
}

export type DjData = {
  id: number;
  name: string;
  creator?: string;
};

export type CoverSize = {
  s: string;
  m: string;
  l: string;
  xl: string;
};

/** 音质 */
export enum QualityType {
  /** Hi-Res */
  HiRes = "Hi-Res", // hr
  /** 无损 */
  SQ = "SQ", // sq / flac
  /** 高质量 */
  HQ = "HQ", // h: 320kbps
  /** 中质量 */
  MQ = "MQ", // m: 192kbps
  /** 低质量 */
  LQ = "LQ", // l: 128kbps
}

export type SongType = {
  id: number;
  name: string;
  artists: MetaData[] | string;
  album: MetaData | string;
  dj?: DjData;
  cover: string;
  coverSize?: CoverSize;
  duration: number;
  // 0: 未知 | 1: 原曲 | 2: 翻唱
  originCoverType?: number;
  alia?: string;
  // 0: 免费或无版权 | 1: VIP 歌曲 | 4: 购买专辑 | 8: 非会员可免费播放低音质，会员可播放高音质及下载
  free: 0 | 1 | 4 | 8;
  mv: number | null;
  path?: string;
  pc?: boolean;
  size?: number;
  quality?: QualityType;
  createTime?: number;
  updateTime?: number;
  playCount?: number;
  // 歌曲类型
  type: "song" | "radio";
};