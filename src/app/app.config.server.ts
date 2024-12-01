import {
  ApplicationConfig,
  mergeApplicationConfig,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideServerRendering(),
    provideClientHydration(withEventReplay()),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
