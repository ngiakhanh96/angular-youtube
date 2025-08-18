import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import {
  provideClientHydration,
  withEventReplay,
  withIncrementalHydration,
} from '@angular/platform-browser';
import { provideServerRendering, withAppShell, withRoutes } from '@angular/ssr';
import { AppComponent } from './app.component';
import { appConfig } from './app.config';
import { serverRoutes } from './server.routes';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(
      withRoutes(serverRoutes),
      withAppShell(AppComponent),
    ),
    provideClientHydration(withEventReplay(), withIncrementalHydration()),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
