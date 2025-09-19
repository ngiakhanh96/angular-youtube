import {
  IItem,
  IPageInfo,
  IThumbnailsInfo,
  IYoutubeResponse,
} from './common.model';

export interface IPlaylistInfo extends IYoutubeResponse<IPlaylistItem> {
  nextPageToken: string;
  pageInfo: IPageInfo;
}

export interface IPlaylistItem extends IItem {
  snippet: IPlaylistSnippet;
  contentDetails: IPlaylistContentDetails;
  status: IPlaylistStatus;
}

export interface IPlaylistSnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: IPlaylistThumbnails;
  channelTitle: string;
  playlistId: string;
  position: number;
  resourceId: IPlaylistResourceId;
  videoOwnerChannelTitle: string;
  videoOwnerChannelId: string;
}

export interface IPlaylistThumbnails {
  default: IThumbnailsInfo;
  medium: IThumbnailsInfo;
  high: IThumbnailsInfo;
  standard: IThumbnailsInfo;
  maxres?: IThumbnailsInfo;
}

export interface IPlaylistResourceId {
  kind: string;
  videoId: string;
}

export interface IPlaylistContentDetails {
  videoId: string;
  videoPublishedAt: string;
}

export interface IPlaylistStatus {
  privacyStatus: string;
}
