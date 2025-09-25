import {
  IItem,
  ILocalized,
  IPageInfo,
  IThumbnailsInfo,
  IYoutubeResponse,
} from './common.model';

export interface IPlaylistInfo extends IYoutubeResponse<IPlaylistItem> {
  pageInfo: IPageInfo;
}

export interface IPlaylistItem extends IItem {
  snippet: IPlaylistSnippet;
  contentDetails: IPlaylistContentDetails;
  status: IPlaylistStatus;
  player: IPlaylistPlayer;
}

export interface IPlaylistSnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: IPlaylistThumbnails;
  channelTitle: string;
  localized: ILocalized;
}

export interface IPlaylistThumbnails {
  default: IThumbnailsInfo;
  medium: IThumbnailsInfo;
  high: IThumbnailsInfo;
  standard: IThumbnailsInfo;
}

export interface IPlaylistContentDetails {
  itemCount: number;
}

export interface IPlaylistPlayer {
  embedHtml: string;
}

export interface IPlaylistStatus {
  privacyStatus: string;
}
