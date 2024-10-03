import {
  HttpClient,
  HttpContext,
  HttpContextToken,
  HttpParams,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { YoutubeApiKey } from '../../injection-tokens/youtube-api-key.injection-token';
import { IYoutubeVideos } from '../../models/http/youtube-video.model';

export const AUTHORIZED = new HttpContextToken<boolean>(() => true);

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {
  private apiKey = inject(YoutubeApiKey);
  private httpClient = inject(HttpClient);

  getOverviewVideos(
    maxResults = 20,
    pageToken?: string
  ): Observable<IYoutubeVideos> {
    const url = 'https://youtube.googleapis.com/youtube/v3/videos';
    const params = new HttpParams({
      fromObject: {
        part: ['snippet,contentDetails,statistics'],
        chart: 'mostPopular',
        regionCode: 'US',
        key: this.apiKey,
        maxResults: maxResults,
      },
    });
    if (pageToken) {
      params.set('pageToken', pageToken);
    }
    return this.httpClient.get<IYoutubeVideos>(url, {
      params: params,
      context: new HttpContext().set(AUTHORIZED, false),
    });
  }

  getChannelInfo() {
    const url = 'https://youtube.googleapis.com/youtube/v3/channels';
    return this.httpClient
      .get<IYoutubeVideos>(url, {
        params: {
          part: ['snippet,contentDetails,statistics'],
          id: 'UCET00YnetHT7tOpu12v8jxg',
          key: this.apiKey,
        },
        context: new HttpContext().set(AUTHORIZED, false),
      })
      .pipe(
        map((res) => {
          console.log(res);
          return res;
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        catchError((err: any) => {
          console.error(err);
          return of(err);
        })
      );
  }
}
