import { IPageInfo, IYoutubeResponse } from './common.model';
import { IPlaylistItem } from './playlist-info.model';

export interface IMyPlaylistsResponse extends IYoutubeResponse<IPlaylistItem> {
  pageInfo: IPageInfo;
  prevPageToken?: string;
  nextPageToken?: string;
}
