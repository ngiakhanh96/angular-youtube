import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IAccessTokenInfo } from '../../models/http/auth.model';
import { AUTHORIZED } from './youtube.http.service';

@Injectable({
  providedIn: 'root',
})
export class AuthHttpService {
  private httpClient = inject(HttpClient);
  //TODO should move to appconfig
  private authBaseUrl = 'https://www.googleapis.com/oauth2/v1/';

  getAccessTokenInfo(accessToken: string) {
    const url = `${this.authBaseUrl}tokeninfo`;
    const params = new HttpParams({
      fromObject: {
        access_token: accessToken,
      },
    });

    return this.httpClient.get<IAccessTokenInfo>(url, {
      params: params,
      context: new HttpContext().set(AUTHORIZED, false),
    });
  }
}
