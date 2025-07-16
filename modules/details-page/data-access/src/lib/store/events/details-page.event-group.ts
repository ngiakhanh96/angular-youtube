import { IInvidiousVideoInfo } from '@angular-youtube/shared-data-access';
import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';
import { IInvidiousVideoCommentsInfo } from 'modules/shared/data-access/src/lib/models/http-response/invidious-video-comments.model';

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
    reset: type<void>(),
  },
});
