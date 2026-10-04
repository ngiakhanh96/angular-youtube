import { IItem } from './common.model';

export interface IYoutubeCommentThread extends IItem {
  kind: 'youtube#commentThread';
  snippet: {
    channelId: string;
    videoId: string;
    topLevelComment: IYoutubeComment;
    canReply: boolean;
    totalReplyCount: number;
    isPublic: boolean;
  };
  // Only included when requested and replies exist; may contain a subset.
  replies?: {
    comments: IYoutubeComment[];
  };
}

export interface IYoutubeComment extends IItem {
  kind: 'youtube#comment';
  snippet: {
    authorDisplayName: string;
    authorProfileImageUrl: string;
    authorChannelUrl?: string;
    authorChannelId?: { value: string };
    channelId: string;
    textDisplay: string;
    // Only returned when the authenticated viewer is the comment's author.
    textOriginal?: string;
    parentId?: string;
    canRate: boolean;
    viewerRating: 'like' | 'none';
    likeCount: number;
    moderationStatus?: 'heldForReview' | 'likelySpam' | 'published' | 'rejected';
    publishedAt: string;
    updatedAt: string;
    imageUrl?: string;
  };
}
