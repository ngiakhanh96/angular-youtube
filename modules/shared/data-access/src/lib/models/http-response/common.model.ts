export interface IYoutubeResponse<T extends IItem> {
  kind: string;
  etag: string;
  items: T[];
}

export interface IDefault {
  url: string;
  width: number;
  height: number;
}

export interface IMedium {
  url: string;
  width: number;
  height: number;
}

export interface IHigh {
  url: string;
  width: number;
  height: number;
}

export interface IStandard {
  url: string;
  width: number;
  height: number;
}

export interface IMaxres {
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
