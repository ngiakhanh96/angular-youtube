import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import {
  provideClientHydration,
  withEventReplay,
  withIncrementalHydration,
} from '@angular/platform-browser';
import { provideServerRendering } from '@angular/ssr';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideClientHydration(withEventReplay(), withIncrementalHydration()),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
