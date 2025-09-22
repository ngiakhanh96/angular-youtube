import {
  IItem,
  IPageInfo,
  IThumbnailsInfo,
  IYoutubeResponse,
} from './common.model';

export interface IPlaylistItemsInfo
  extends IYoutubeResponse<IPlaylistDetailItem> {
  nextPageToken: string;
  pageInfo: IPageInfo;
}

export interface IPlaylistDetailItem extends IItem {
  snippet: IPlaylistItemsSnippet;
  contentDetails: IPlaylistItemsContentDetails;
  status: IPlaylistItemsStatus;
}

export interface IPlaylistItemsSnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: IPlaylistItemsThumbnails;
  channelTitle: string;
  playlistId: string;
  position: number;
  resourceId: IPlaylistItemsResourceId;
  videoOwnerChannelTitle: string;
  videoOwnerChannelId: string;
}

export interface IPlaylistItemsThumbnails {
  default: IThumbnailsInfo;
  medium: IThumbnailsInfo;
  high: IThumbnailsInfo;
  standard: IThumbnailsInfo;
  maxres?: IThumbnailsInfo;
}

export interface IPlaylistItemsResourceId {
  kind: string;
  videoId: string;
}

export interface IPlaylistItemsContentDetails {
  videoId: string;
  videoPublishedAt: string;
}

export interface IPlaylistItemsStatus {
  privacyStatus: string;
}
