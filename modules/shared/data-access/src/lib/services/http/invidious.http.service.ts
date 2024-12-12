import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AUTHORIZED } from '../../http-context-tokens/authorized.http-context-token';
import { IInvidiousVideoInfo } from '../../models/http-response/invidious-video-info.model';

@Injectable({
  providedIn: 'root',
})
export class InvidiousHttpService {
  private httpClient = inject(HttpClient);
  //TODO should move to appconfig
  private baseUrl = 'https://invidious.nerdvpn.de/api/v1/';

  getVideoInfo(videoId: string) {
    const url = `${this.baseUrl}videos/${videoId}`;

    return this.httpClient.get<IInvidiousVideoInfo>(url, {
      context: new HttpContext().set(AUTHORIZED, false),
    });
  }
}
