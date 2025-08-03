export interface IAppSettings {
  googleAuthApiBaseUrl: string;
  invidiousApiBaseUrl: string;
  youtubeApiBaseUrl: string;
  ytDlpApiBaseUrl: string;
  regionCode: string;
  languageCode: string;
  supportedSocialMedias: Record<string, string>;
}
