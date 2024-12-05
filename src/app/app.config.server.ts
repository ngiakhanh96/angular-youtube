import {
  ApplicationConfig,
  mergeApplicationConfig,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  provideClientHydration,
  withEventReplay,
  withIncrementalHydration,
} from '@angular/platform-browser';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideServerRendering(),
    provideClientHydration(withEventReplay(), withIncrementalHydration()),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
