import {
  HttpClient,
  HttpContext,
  HttpContextToken,
  HttpParams,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { YoutubeApiKey } from '../../injection-tokens/youtube-api-key.injection-token';
import { IYoutubeChannelsInfo } from '../../models/http/channels-info.model';
import { IMyChannelInfo } from '../../models/http/my-channel-info.model';
import { IPopularYoutubeVideos } from '../../models/http/popular-youtube-videos.model';
import { IVideoCategories } from '../../models/http/video-categories-model';

export const AUTHORIZED = new HttpContextToken<boolean>(() => true);

@Injectable({
  providedIn: 'root',
})
export class YoutubeHttpService {
  private apiKey = inject(YoutubeApiKey);
  private httpClient = inject(HttpClient);
  //TODO should move to appconfig
  private youtubeBaseUrl = 'https://youtube.googleapis.com/youtube/v3/';

  getVideoCategories() {
    const url = `${this.youtubeBaseUrl}videoCategories`;
    const params = new HttpParams({
      fromObject: {
        part: ['snippet'],
        regionCode: 'VN',
        key: this.apiKey,
      },
    });

    return this.httpClient.get<IVideoCategories>(url, {
      params: params,
      context: new HttpContext().set(AUTHORIZED, false),
    });
  }

  getPopularVideos(
    maxResults = 20,
    videoCategoryId?: number,
    pageToken?: string,
  ): Observable<IPopularYoutubeVideos> {
    const url = `${this.youtubeBaseUrl}videos`;
    let params = new HttpParams({
      fromObject: {
        part: ['snippet,contentDetails,statistics'],
        chart: 'mostPopular',
        regionCode: 'VN',
        key: this.apiKey,
        maxResults: maxResults,
      },
    });
    if (pageToken) {
      params = params.append('pageToken', pageToken);
    }

    if (videoCategoryId) {
      params = params.append('videoCategoryId', videoCategoryId);
    }
    return this.httpClient.get<IPopularYoutubeVideos>(url, {
      params: params,
      context: new HttpContext().set(AUTHORIZED, false),
    });
  }

  getChannelsInfo(channelIds: string[], maxResults = 20, pageToken?: string) {
    const url = `${this.youtubeBaseUrl}channels`;
    let params = new HttpParams({
      fromObject: {
        part: ['snippet,contentDetails,statistics'],
        id: channelIds,
        key: this.apiKey,
        maxResults: maxResults,
      },
    });
    if (pageToken) {
      params = params.append('pageToken', pageToken);
    }
    return this.httpClient.get<IYoutubeChannelsInfo>(url, {
      params: params,
      context: new HttpContext().set(AUTHORIZED, false),
    });
  }

  getMyChannelInfo() {
    const url = `${this.youtubeBaseUrl}channels`;
    const params = new HttpParams({
      fromObject: {
        part: ['snippet,contentDetails,statistics'],
        mine: true,
        key: this.apiKey,
      },
    });

    return this.httpClient.get<IMyChannelInfo>(url, {
      params: params,
      context: new HttpContext().set(AUTHORIZED, true),
    });
  }
}
