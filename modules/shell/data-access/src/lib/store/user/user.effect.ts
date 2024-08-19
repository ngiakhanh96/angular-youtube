import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { signIn, signInError, signInSuccess } from './user.action';
import { GoogleLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
import { UserError } from '@angular-youtube/shared-data-access';

@Injectable()
export class UserEffect {
  private actions$ = inject(Actions);
  private authService = inject(SocialAuthService);

  public signIn$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(signIn),
      mergeMap((_) =>
        from(this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)).pipe(
          map((response) =>
            signInSuccess({
              user: response,
            })
          ),
          catchError((error: UserError) => of(signInError(error)))
        )
      )
    );
  });
}
