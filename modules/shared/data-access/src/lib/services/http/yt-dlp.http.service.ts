import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AUTHORIZED } from '../../http-context-tokens/authorized.http-context-token';
import { IYtDlpVideosRequest } from '../../models/http-request/yt-dlp-videos.request.model';
import { IYtDlpVideosResponse } from '../../models/http-response/yt-dlp-videos.response.model';
import { AppSettingsService } from '../app-settings.service';

@Injectable({
  providedIn: 'root',
})
export class YtDlpHttpService {
  private httpClient = inject(HttpClient);
  private appSettingsService = inject(AppSettingsService);
  private baseUrl = this.appSettingsService.appConfig()?.ytDlpApiBaseUrl;

  getVideosInfo(request: IYtDlpVideosRequest) {
    const url = `${this.baseUrl}videos`;

    return this.httpClient.post<IYtDlpVideosResponse>(url, request, {
      context: new HttpContext().set(AUTHORIZED, false),
    });
  }
}
