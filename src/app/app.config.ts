import {
  GoogleLoginProvider,
  SocialAuthServiceConfig,
  SocialLoginModule,
} from '@abacritt/angularx-social-login';
import { YoutubeApiKey } from '@angular-youtube/shared-data-access';
import { authInterceptor } from '@angular-youtube/shell-data-access';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, mergeApplicationConfig, provideExperimentalZonelessChangeDetection, inject, provideAppInitializer } from '@angular/core';
import { MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { mainRoutes } from './routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore(),
    provideEffects(),
    provideAnimations(),
    provideExperimentalZonelessChangeDetection(),
    {
      provide: MAT_RIPPLE_GLOBAL_OPTIONS,
      useValue: {
        animation: {
          enterDuration: 200,
          exitDuration: 200,
        },
      },
    },
    provideRouter(
      mainRoutes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
      }),
    ),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideStoreDevtools({ maxAge: 25, logOnly: false }),
    importProvidersFrom(SocialLoginModule),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        lang: 'en',
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '387433020564-0q4ii59780k1ecqvueub42qj1ohdpktv.apps.googleusercontent.com',
              {
                scopes: `https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.channel-memberships.creator https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtubepartner https://www.googleapis.com/auth/youtubepartner-channel-audit`,
              },
            ),
          },
        ],
        onError: (err) => {
          console.error(err);
        },
      } as SocialAuthServiceConfig,
    },
    {
      provide: YoutubeApiKey,
      useValue: 'AIzaSyCn5erIAtKzaNiuh-5IJgnorW7yOEH5gyE',
    },
    provideAppInitializer(() => {
        const initializerFn = ((iconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) => () => {
          const defaultFontSetClasses = iconRegistry.getDefaultFontSetClass();
          const outlinedFontSetClasses = defaultFontSetClasses
            .filter((fontSetClass) => fontSetClass !== 'material-icons')
            .concat(['material-symbols-outlined']);
          iconRegistry.setDefaultFontSetClass(...outlinedFontSetClasses);
          iconRegistry.addSvgIconSet(
            domSanitizer.bypassSecurityTrustResourceUrl('assets/icons.svg'),
          );
        })(inject(MatIconRegistry), inject(DomSanitizer));
        return initializerFn();
      }),
  ],
};

const zonelessConfig: ApplicationConfig = {
  providers: [provideExperimentalZonelessChangeDetection()],
};
export const csrConfig = mergeApplicationConfig(appConfig, zonelessConfig);
