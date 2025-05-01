import { IInvidiousVideoInfo } from '@angular-youtube/shared-data-access';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IInvidiousVideoCommentsInfo } from 'modules/shared/data-access/src/lib/models/http-response/invidious-video-comments.model';
export const detailsPageActionGroup = createActionGroup({
  source: 'HomePage',
  events: {
    loadYoutubeVideo: props<{
      videoId: string;
    }>(),
    loadYoutubeVideoSuccess: props<{
      videoInfo: IInvidiousVideoInfo;
      recommendedVideosInfo: IInvidiousVideoInfo[];
    }>(),
    loadYoutubeVideoComments: props<{
      commentId?: string;
      videoId: string;
      sortBy?: string;
      continuation?: string;
    }>(),
    loadYoutubeVideoCommentsSuccess: props<{
      commentId?: string;
      commentsInfo: IInvidiousVideoCommentsInfo;
    }>(),
    reset: emptyProps(),
  },
});
