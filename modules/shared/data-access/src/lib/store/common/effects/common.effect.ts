import { inject } from '@angular/core';
import { createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';
import { SessionStorage } from '../../../services/session-storage.service';
import { BaseEffects } from '../../base/effects/base.effect';
import { commonActionGroup } from '../actions/common.action-group';

export class CommonEffects extends BaseEffects<typeof commonActionGroup> {
  private cookieService = inject(SessionStorage);
  updateAccessToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.actionsGroup.updateAccessToken),
      map((action) => {
        if (action.accessToken != null) {
          this.cookieService.setItem('Authorization', action.accessToken);
        } else {
          this.cookieService.removeItem('Authorization');
        }
        return this.actionsGroup.updateAccessTokenSuccess();
      })
    )
  );

  constructor() {
    super(commonActionGroup);
  }
}
