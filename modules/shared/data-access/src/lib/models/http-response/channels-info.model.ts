import {
  IItem,
  IPageInfo,
  IThumbnailsInfo,
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
  default: IThumbnailsInfo;
  medium: IThumbnailsInfo;
  high: IThumbnailsInfo;
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
