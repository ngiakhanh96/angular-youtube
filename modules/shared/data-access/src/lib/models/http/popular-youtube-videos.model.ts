import {
  IDefault,
  IHigh,
  ILocalized,
  IMaxres,
  IMedium,
  IPageInfo,
  IStandard,
} from './common.model';

export interface IPopularYoutubeVideos {
  kind: string;
  etag: string;
  items: IVideoItem[];
  prevPageToken?: string;
  nextPageToken?: string;
  pageInfo: IPageInfo;
}

export interface IVideoItem {
  kind: string;
  etag: string;
  id: string;
  snippet: IVideoSnippet;
  contentDetails: IVideoContentDetails;
  statistics: IVideoStatistics;
}

export interface IVideoSnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: IVideoThumbnails;
  channelTitle: string;
  tags?: string[];
  categoryId: string;
  liveBroadcastContent: string;
  defaultLanguage?: string;
  localized: ILocalized;
  defaultAudioLanguage?: string;
}

export interface IVideoThumbnails {
  default: IDefault;
  medium: IMedium;
  high: IHigh;
  standard: IStandard;
  maxres?: IMaxres;
}

export interface IVideoContentDetails {
  duration: string;
  dimension: string;
  definition: string;
  caption: string;
  licensedContent: boolean;
  contentRating: object;
  projection: string;
}

export interface IVideoStatistics {
  viewCount: string;
  likeCount: string;
  favoriteCount: string;
  commentCount: string;
}
