import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AUTHORIZED } from '../../http-context-tokens/authorized.http-context-token';
import { IYtDlpVideosRequest } from '../../models/http-request/yt-dlp-videos.request.model';
import { IYtDlpVideosResponse } from '../../models/http-response/yt-dlp-videos.response.model';

@Injectable({
  providedIn: 'root',
})
export class YtDlpHttpService {
  private httpClient = inject(HttpClient);
  //TODO should move to appconfig
  private baseUrl = 'https://localhost:7575/api/v1/';

  getVideosInfo(request: IYtDlpVideosRequest) {
    const url = `${this.baseUrl}videos`;

    return this.httpClient.post<IYtDlpVideosResponse>(url, request, {
      context: new HttpContext().set(AUTHORIZED, false),
    });
  }
}
