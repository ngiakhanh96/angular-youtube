import {
  IDefault,
  IHigh,
  IItem,
  IMedium,
  IPageInfo,
  IYoutubeResponse,
} from './common.model';
import { IMyChannelSnippet } from './my-channel-info.model';

export interface IYoutubeChannelsInfo extends IYoutubeResponse<IChannelItem> {
  pageInfo: IPageInfo;
}

export interface IChannelItem extends IItem {
  snippet: IChannelSnippet;
  contentDetails: IChannelContentDetails;
  statistics: IChannelStatistics;
}

export interface IChannelSnippet extends IMyChannelSnippet {
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
