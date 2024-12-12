import {
  IChannelContentDetails,
  IChannelItem,
  IChannelStatistics,
  IChannelThumbnails,
} from './channels-info.model';
import { IItem, ILocalized, IPageInfo, IYoutubeResponse } from './common.model';

export interface IMyChannelInfo extends IYoutubeResponse<IChannelItem> {
  pageInfo: IPageInfo;
}

export interface IMyChannelItem extends IItem {
  snippet: IMyChannelSnippet;
  contentDetails: IChannelContentDetails;
  statistics: IChannelStatistics;
}

export interface IMyChannelSnippet {
  title: string;
  description: string;
  customUrl: string;
  publishedAt: string;
  thumbnails: IChannelThumbnails;
  localized: ILocalized;
}
