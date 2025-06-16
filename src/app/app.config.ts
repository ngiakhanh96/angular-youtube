import {
  AppSettingsService,
  GoogleLoginProvider,
  provideSocialAuth,
  provideYoutubeApiKey,
} from '@angular-youtube/shared-data-access';
import { provideAySkeletonLoader } from '@angular-youtube/shared-ui';
import { authInterceptor } from '@angular-youtube/shell-data-access';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import {
  ApplicationConfig,
  ErrorHandler,
  inject,
  provideAppInitializer,
  provideZonelessChangeDetection,
} from '@angular/core';
import { MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  PreloadAllModules,
  provideRouter,
  withInMemoryScrolling,
  withPreloading,
} from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { GlobalErrorHandler } from './global-error-handler';
import { mainRoutes } from './routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore(),
    provideEffects(),
    provideAnimations(),
    provideZonelessChangeDetection(),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
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
      withPreloading(PreloadAllModules),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
      }),
    ),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideStoreDevtools({ maxAge: 25, logOnly: false }),
    provideSocialAuth({
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
    }),
    provideYoutubeApiKey('AIzaSyCn5erIAtKzaNiuh-5IJgnorW7yOEH5gyE'),
    provideAySkeletonLoader({
      theme: {
        extendsFromRoot: true,
      },
    }),
    provideAppInitializer(async () => {
      const iconRegistry = inject(MatIconRegistry);
      const domSanitizer = inject(DomSanitizer);
      const appSettingsService = inject(AppSettingsService);
      const defaultFontSetClasses = iconRegistry.getDefaultFontSetClass();
      const outlinedFontSetClasses = defaultFontSetClasses
        .filter((fontSetClass) => fontSetClass !== 'material-icons')
        .concat(['material-symbols-outlined']);
      iconRegistry.setDefaultFontSetClass(...outlinedFontSetClasses);
      iconRegistry.addSvgIconSet(
        domSanitizer.bypassSecurityTrustResourceUrl('assets/icons.svg'),
      );
      return await appSettingsService.getAppConfig();
    }),
  ],
};
