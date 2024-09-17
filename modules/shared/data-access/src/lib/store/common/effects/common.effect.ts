import { inject } from '@angular/core';
import { createEffect, ofType } from '@ngrx/effects';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { map } from 'rxjs';
import { BaseEffects } from '../../base/effects/base.effect';
import { commonActionGroup } from '../actions/common.action-group';

export class CommonEffects extends BaseEffects<typeof commonActionGroup> {
  private cookieService = inject(SsrCookieService);
  updateAccessToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.actionsGroup.updateAccessToken),
      map((action) => {
        if (action.accessToken != null) {
          this.cookieService.set('Authorization', action.accessToken);
        } else {
          this.cookieService.delete('Authorization');
        }
        return this.actionsGroup.updateAccessTokenSuccess();
      })
    )
  );

  constructor() {
    super(commonActionGroup);
  }
}
