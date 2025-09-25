import {
  IInvidiousVideoCommentsInfo,
  IInvidiousVideoInfo,
  IPlaylistInfo,
  IPlaylistItemsInfo,
} from '@angular-youtube/shared-data-access';
import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';

export const detailsPageEventGroup = eventGroup({
  source: 'HomePage',
  events: {
    loadYoutubeVideo: type<{
      videoId: string;
    }>(),
    loadYoutubeVideoSuccess: type<{
      videoInfo: IInvidiousVideoInfo;
      recommendedVideosInfo: IInvidiousVideoInfo[];
    }>(),
    loadYoutubeVideoComments: type<{
      commentId?: string;
      videoId: string;
      sortBy?: string;
      continuation?: string;
    }>(),
    loadYoutubeVideoCommentsSuccess: type<{
      commentId?: string;
      commentsInfo: IInvidiousVideoCommentsInfo;
      continuation?: string;
    }>(),
    loadYoutubePlaylistInfo: type<{
      playlistId: string;
    }>(),
    loadYoutubePlaylistInfoSuccess: type<{
      playlistInfo: IPlaylistInfo;
    }>(),
    loadYoutubePlaylistItemsInfo: type<{
      playlistId: string;
      nextPage?: boolean;
    }>(),
    loadYoutubePlaylistItemsInfoSuccess: type<{
      playlistItemsInfo: IPlaylistItemsInfo;
      nextPage?: boolean;
    }>(),
    reset: type<void>(),
  },
});
