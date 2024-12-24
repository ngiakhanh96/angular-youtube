export interface IYtDlpVideosResponse {
  videoInfos: IYtDlpVideoInfo[];
}

export interface IYtDlpVideoInfo {
  videoId: string;
  downloadLink: string;
}
