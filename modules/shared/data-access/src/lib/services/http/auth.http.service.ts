import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AUTHORIZED } from '../../http-context-tokens/authorized.http-context-token';
import { IAccessTokenInfo } from '../../models/http-response/auth.model';
import { AppSettingsService } from '../app-settings.service';

@Injectable({
  providedIn: 'root',
})
export class AuthHttpService {
  private httpClient = inject(HttpClient);
  private appSettingsService = inject(AppSettingsService);
  private baseUrl = this.appSettingsService.appConfig()?.googleAuthApiBaseUrl;

  getAccessTokenInfo(accessToken: string) {
    const url = `${this.baseUrl}tokeninfo`;
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
