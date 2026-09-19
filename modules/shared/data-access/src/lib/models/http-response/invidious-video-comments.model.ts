export interface IInvidiousVideoCommentsInfo {
  commentCount: number;
  videoId: string;
  comments: IVideoComment[];
  continuation?: string;
}

export interface IVideoComment {
  commentId: string;
  author: string;
  authorThumbnail: string;
  authorUrl: string;
  authorId: string;
  verified: boolean;
  content: string;
  contentHtml: string;
  likeCount: number;
  published: number;
  publishedText: string;
  replies?: IVideoCommentReplies;
  isEdited: boolean;
  isPinned: boolean;
  isSponsor?: boolean;
  sponsorIconUrl?: string;
  authorIsChannelOwner: boolean;
}

export interface IVideoCommentReplies {
  replyCount: number;
  continuation: string;
}
