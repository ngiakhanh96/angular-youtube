import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { YoutubeApiKey } from '../../injection-tokens/youtube-api-key.injection-token';
import { IYoutubeVideos } from '../../models/http/youtube-video.model';

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {
  private apiKey = inject(YoutubeApiKey);
  private httpClient = inject(HttpClient);

  getOverviewVideos() {
    const url = 'https://youtube.googleapis.com/youtube/v3/videos';
    return this.httpClient
      .get<IYoutubeVideos>(url, {
        params: {
          part: ['snippet,contentDetails,statistics'],
          chart: 'mostPopular',
          regionCode: 'US',
          key: this.apiKey,
        },
      })
      .pipe(
        map((res) => {
          console.log(res);
          return res;
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        catchError((err: any) => {
          console.error(err);
          return err;
        })
      );
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
      })
      .pipe(
        map((res) => {
          console.log(res);
          return res;
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        catchError((err: any) => {
          console.error(err);
          return err;
        })
      );
  }
}
