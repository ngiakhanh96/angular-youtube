import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AUTHORIZED } from '../../http-context-tokens/authorized.http-context-token';
import { IInvidiousSearchedVideoInfo } from '../../models/http-response/invidious-searched-video-info.model';
import { IInvidiousVideoCommentsInfo } from '../../models/http-response/invidious-video-comments.model';
import { IInvidiousVideoInfo } from '../../models/http-response/invidious-video-info.model';
import { AppSettingsService } from '../app-settings.service';

@Injectable({
  providedIn: 'root',
})
export class InvidiousHttpService {
  private httpClient = inject(HttpClient);
  private appSettingsService = inject(AppSettingsService);
  private baseUrl = this.appSettingsService.appConfig()?.invidiousApiBaseUrl;

  getVideoInfo(videoId: string) {
    const url = `${this.baseUrl}videos/${videoId}`;

    return this.httpClient.get<IInvidiousVideoInfo>(url, {
      context: new HttpContext().set(AUTHORIZED, false),
    });
  }

  searchVideosInfo(searchTerm: string, page: number) {
    const url = `${this.baseUrl}search`;

    return this.httpClient.get<IInvidiousSearchedVideoInfo[]>(url, {
      context: new HttpContext().set(AUTHORIZED, false),
      params: {
        q: searchTerm,
        page: page,
        type: 'video',
        sort: 'relevance',
      },
    });
  }

  getVideoCommentsInfo(
    videoId: string,
    sortBy?: string,
    continuation?: string,
  ) {
    const url = `${this.baseUrl}comments/${videoId}`;
    let params = new HttpParams();
    if (sortBy) {
      params = params.set('sort_by', sortBy);
    }
    if (continuation) {
      params = params.set('continuation', continuation);
    }

    return this.httpClient.get<IInvidiousVideoCommentsInfo>(url, {
      context: new HttpContext().set(AUTHORIZED, false),
      params: params,
    });
  }
}
