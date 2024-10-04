import {
  IDefault,
  IHigh,
  ILocalized,
  IMedium,
  IPageInfo,
} from './common.model';

export interface IYoutubeChannelsInfo {
  kind: string;
  etag: string;
  pageInfo: IPageInfo;
  items: IChannelItem[];
}

export interface IChannelItem {
  kind: string;
  etag: string;
  id: string;
  snippet: IChannelSnippet;
  contentDetails: IChannelContentDetails;
  statistics: IChannelStatistics;
}

export interface IChannelSnippet {
  title: string;
  description: string;
  customUrl: string;
  publishedAt: string;
  thumbnails: IChannelThumbnails;
  localized: ILocalized;
  country: string;
}

export interface IChannelThumbnails {
  default: IDefault;
  medium: IMedium;
  high: IHigh;
}

export interface IChannelContentDetails {
  relatedPlaylists: RelatedPlaylists;
}

export interface RelatedPlaylists {
  likes: string;
  uploads: string;
}

export interface IChannelStatistics {
  viewCount: string;
  subscriberCount: string;
  hiddenSubscriberCount: boolean;
  videoCount: string;
}
