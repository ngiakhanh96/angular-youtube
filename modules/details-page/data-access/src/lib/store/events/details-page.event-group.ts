import {
  IInvidiousVideoCommentsInfo,
  IInvidiousVideoInfo,
  IPlaylistInfo,
  IPlaylistItemsInfo,
  IVideoComment,
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
      sortBy: 'top' | 'new';
      continuation?: string;
      nextPage?: boolean;
    }>(),
    loadYoutubeVideoCommentsSuccess: type<{
      commentId?: string;
      commentsInfo: IInvidiousVideoCommentsInfo;
      continuation?: string;
      nextPage?: boolean;
    }>(),
    postYoutubeVideoComment: type<{
      videoId: string;
      channelId: string;
      text: string;
    }>(),
    postYoutubeVideoCommentSuccess: type<{
      videoId: string;
      comment: IVideoComment;
    }>(),
    postYoutubeVideoReply: type<{
      videoId: string;
      parentId: string;
      text: string;
    }>(),
    postYoutubeVideoReplySuccess: type<{
      videoId: string;
      parentId: string;
      comment: IVideoComment;
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
