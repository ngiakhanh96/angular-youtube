import {
  IInvidiousVideoCommentsInfo,
  IInvidiousVideoInfo,
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
      nextPage?: boolean;
    }>(),
    loadYoutubePlaylistInfoSuccess: type<{
      playlistInfo: IPlaylistItemsInfo;
      nextPage?: boolean;
    }>(),
    reset: type<void>(),
  },
});
