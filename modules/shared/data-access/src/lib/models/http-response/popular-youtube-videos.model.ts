import {
  IItem,
  ILocalized,
  IPageInfo,
  IThumbnailsInfo,
  IYoutubeResponse,
} from './common.model';

export interface IPopularYoutubeVideos extends IYoutubeResponse<IVideoItem> {
  prevPageToken?: string;
  nextPageToken?: string;
  pageInfo: IPageInfo;
}

export interface IVideoItem extends IItem {
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
  default: IThumbnailsInfo;
  medium: IThumbnailsInfo;
  high: IThumbnailsInfo;
  standard: IThumbnailsInfo;
  maxres?: IThumbnailsInfo;
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
