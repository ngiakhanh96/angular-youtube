import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { extModules } from './build-specifics';
import { RouterModule } from '@angular/router';
import { shellRoutes } from './shell-feature.routes';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { LayoutModule } from './layout/layout.module';
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
  GoogleLoginProvider,
} from 'angularx-social-login';

@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    RouterModule.forRoot(shellRoutes, {
      scrollPositionRestoration: 'top',
    }),
    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot([]),
    SocialLoginModule,
    ...extModules,
  ],
  exports: [RouterModule],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '387433020564-0q4ii59780k1ecqvueub42qj1ohdpktv.apps.googleusercontent.com',
              {
                scope: `https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.channel-memberships.creator https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtubepartner https://www.googleapis.com/auth/youtubepartner-channel-audit`,
              }
            ),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
  declarations: [],
})
export class ShellFeatureModule {}
