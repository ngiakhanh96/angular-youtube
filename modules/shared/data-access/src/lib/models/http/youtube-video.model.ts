export interface IYoutubeVideos {
  kind: string;
  etag: string;
  items: IItem[];
  nextPageToken: string;
  pageInfo: IPageInfo;
}

export interface IItem {
  kind: string;
  etag: string;
  id: string;
  snippet: ISnippet;
  contentDetails: IContentDetails;
  statistics: IStatistics;
}

export interface ISnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: IThumbnails;
  channelTitle: string;
  tags?: string[];
  categoryId: string;
  liveBroadcastContent: string;
  defaultLanguage?: string;
  localized: ILocalized;
  defaultAudioLanguage?: string;
}

export interface IThumbnails {
  default: IDefault;
  medium: IMedium;
  high: IHigh;
  standard: IStandard;
  maxres?: IMaxres;
}

export interface IDefault {
  url: string;
  width: number;
  height: number;
}

export interface IMedium {
  url: string;
  width: number;
  height: number;
}

export interface IHigh {
  url: string;
  width: number;
  height: number;
}

export interface IStandard {
  url: string;
  width: number;
  height: number;
}

export interface IMaxres {
  url: string;
  width: number;
  height: number;
}

export interface ILocalized {
  title: string;
  description: string;
}

export interface IContentDetails {
  duration: string;
  dimension: string;
  definition: string;
  caption: string;
  licensedContent: boolean;
  contentRating: object;
  projection: string;
}

export interface IStatistics {
  viewCount: string;
  likeCount: string;
  favoriteCount: string;
  commentCount: string;
}

export interface IPageInfo {
  totalResults: number;
  resultsPerPage: number;
}
