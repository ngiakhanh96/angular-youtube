import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {
  private apiKey = 'AIzaSyCn5erIAtKzaNiuh-5IJgnorW7yOEH5gyE';
  private httpClient = inject(HttpClient);

  getOverviewVideos() {
    const url = 'https://youtube.googleapis.com/youtube/v3/videos';
    return this.httpClient.get<any>(url, {params: {
        'part': [
            'snippet,contentDetails,statistics'
        ],
        'chart': 'mostPopular',
        'regionCode': 'US',
        'key': this.apiKey
    }})
      .pipe(
        map((res) => {
            console.log(res);
            return res;
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        catchError((err: any) => {
            console.error(err);
            return err;
        }),
    );
  }
}