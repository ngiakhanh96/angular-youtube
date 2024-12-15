export interface IInvidiousVideoInfo {
  type: string;
  title: string;
  videoId: string;
  videoThumbnails: IVideoThumbnail[];
  storyboards: IStoryboard[];
  description: string;
  descriptionHtml: string;
  published: number;
  publishedText: string;
  keywords: string[];
  viewCount: number;
  likeCount: number;
  dislikeCount: number;
  paid: boolean;
  premium: boolean;
  isFamilyFriendly: boolean;
  allowedRegions: string[];
  genre: string;
  genreUrl: string | null;
  author: string;
  authorId: string;
  authorUrl: string;
  authorVerified: boolean;
  authorThumbnails: IAuthorThumbnail[];
  subCountText: string;
  lengthSeconds: number;
  allowRatings: boolean;
  rating: number;
  isListed: boolean;
  liveNow: boolean;
  isPostLiveDvr: boolean;
  isUpcoming: boolean;
  dashUrl: string;
  adaptiveFormats: IAdaptiveFormat[];
  formatStreams: IFormatStream[];
  captions: ICaption[];
  recommendedVideos: IRecommendedVideo[];
}

export interface IVideoThumbnail {
  quality: string;
  url: string;
  width: number;
  height: number;
}

export interface IStoryboard {
  url: string;
  templateUrl: string;
  width: number;
  height: number;
  count: number;
  interval: number;
  storyboardWidth: number;
  storyboardHeight: number;
  storyboardCount: number;
}

export interface IAuthorThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface IFormatStream {
  url: string;
  itag: string;
  type: string;
  quality: string;
  bitrate: string;
  fps: number;
  size: string;
  resolution: string;
  qualityLabel: string;
  container: string;
  encoding: string;
}

export interface ICaption {
  label: string;
  language_code: string;
  url: string;
}

export interface IRecommendedVideo {
  videoId?: string;
  title?: string;
  videoThumbnails?: IVideoThumbnail[];
  author?: string;
  authorUrl?: string;
  authorId?: string;
  authorVerified?: boolean;
  lengthSeconds?: number;
  viewCountText?: string;
  viewCount?: number;
}

export interface IAdaptiveFormat {
  init: string;
  index: string;
  bitrate: string;
  url: string;
  itag: string;
  type: string;
  clen: string;
  lmt: string;
  projectionType: string;
  container: string;
  encoding: string;
  audioQuality?: string;
  audioSampleRate?: number;
  audioChannels?: number;
  fps?: number;
  size?: string;
  resolution?: string;
  qualityLabel?: string;
  colorInfo?: IColorInfo;
}

export interface IColorInfo {
  primaries: string;
  transferCharacteristics: string;
  matrixCoefficients: string;
}
