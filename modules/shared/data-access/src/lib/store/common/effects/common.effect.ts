import { inject } from '@angular/core';
import { createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';
import { SessionStorage } from '../../../services/session-storage.service';
import { BaseEffects } from '../../base/effects/base.effect';
import { loginActionGroup } from '../actions/common.action-group';

export class CommonEffects extends BaseEffects {
  private cookieService = inject(SessionStorage);
  updateAccessToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginActionGroup.updateAccessToken),
      map((action) => {
        if (action.accessToken != null) {
          this.cookieService.setItem('Authorization', action.accessToken);
        } else {
          this.cookieService.removeItem('Authorization');
        }
        return loginActionGroup.updateAccessTokenSuccess();
      })
    )
  );
}
