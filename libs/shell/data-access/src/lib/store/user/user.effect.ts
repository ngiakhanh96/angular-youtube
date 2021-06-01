import { UserError } from '@angular-youtube/shared/data-access';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { from, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { signIn, signInError, signInSuccess } from './user.action';

@Injectable()
export class UserEffect {
  constructor(
    private authService: SocialAuthService,
    private actions$: Actions
  ) {}

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
