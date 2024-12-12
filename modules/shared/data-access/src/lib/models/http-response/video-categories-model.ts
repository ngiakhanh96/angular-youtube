import { IItem, IYoutubeResponse } from './common.model';

export type IVideoCategories = IYoutubeResponse<IVideoCategoryItem>;

export interface IVideoCategoryItem extends IItem {
  snippet: IVideoCategorySnippet;
}

export interface IVideoCategorySnippet {
  title: string;
  assignable: boolean;
  channelId: string;
}
