import {
  IAuthorThumbnail,
  IVideoThumbnail,
} from './invidious-video-info.model';

export interface IInvidiousSearchedVideoInfo {
  type: 'video' | 'scheduled' | 'livestream';
  title: string;
  videoId: string;
  author: string;
  authorId: string;
  authorUrl: string;
  authorVerified: boolean;
  authorThumbnails: IAuthorThumbnail[];
  videoThumbnails: IVideoThumbnail[];
  description: string;
  descriptionHtml: string;
  viewCount: number;
  viewCountText: string;
  published: number;
  publishedText: string;
  lengthSeconds: number;
  liveNow: boolean;
  premium: boolean;
  isUpcoming: boolean;
  isNew: boolean;
  is4k: boolean;
  is8k: boolean;
  isVr180: boolean;
  isVr360: boolean;
  is3d: boolean;
  hasCaptions: boolean;
}
