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
import { IPopularYoutubeVideos } from '../../models/http/popular-youtube-videos.model';

export const AUTHORIZED = new HttpContextToken<boolean>(() => true);

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {
  private apiKey = inject(YoutubeApiKey);
  private httpClient = inject(HttpClient);
  private commonUrl = 'https://youtube.googleapis.com/youtube/v3/';

  getPopularVideos(
    maxResults = 20,
    pageToken?: string
  ): Observable<IPopularYoutubeVideos> {
    const url = `${this.commonUrl}videos`;
    let params = new HttpParams({
      fromObject: {
        part: ['snippet,contentDetails,statistics'],
        chart: 'mostPopular',
        regionCode: 'US',
        key: this.apiKey,
        maxResults: maxResults,
      },
    });
    if (pageToken) {
      params = params.append('pageToken', pageToken);
    }
    return this.httpClient.get<IPopularYoutubeVideos>(url, {
      params: params,
      context: new HttpContext().set(AUTHORIZED, false),
    });
  }

  getChannelsInfo(channelIds: string[], maxResults = 20, pageToken?: string) {
    const url = `${this.commonUrl}channels`;
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
}
