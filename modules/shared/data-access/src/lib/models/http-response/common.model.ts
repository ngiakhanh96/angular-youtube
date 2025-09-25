export interface IYoutubeResponse<T extends IItem> {
  kind: string;
  etag: string;
  items: T[];
}

export interface IThumbnailsInfo {
  url: string;
  width: number;
  height: number;
}

export interface ILocalized {
  title: string;
  description: string;
}

export interface IPageInfo {
  totalResults: number;
  resultsPerPage: number;
}

export interface IItem {
  kind: string;
  etag: string;
  id: string;
}
