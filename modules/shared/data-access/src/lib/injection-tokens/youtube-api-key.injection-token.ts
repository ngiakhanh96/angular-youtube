import { InjectionToken, makeEnvironmentProviders } from '@angular/core';

export const YoutubeApiKey = new InjectionToken<string>('YoutubeApiKey');
export function provideYoutubeApiKey(apiKey: string) {
  return makeEnvironmentProviders([
    {
      provide: YoutubeApiKey,
      useValue: apiKey,
    },
  ]);
}
