import { InjectionToken, makeEnvironmentProviders } from '@angular/core';

export type AySkeletonLoaderConfigTheme = {
  /** It enforces a combination of `fromRoot` styles with component `styles` attribute */
  extendsFromRoot?: boolean;
  // This is required since [style] is using `any` as well
  // More details in https://angular.dev/api/common/NgStyle
  [k: string]: any;
} | null;

export interface AySkeletonLoaderConfig {
  appearance: 'circle' | 'line' | 'custom-content' | '';
  animation: 'progress' | 'progress-dark' | 'pulse' | 'false' | false;
  theme: AySkeletonLoaderConfigTheme;
  loadingText: string;
  count: number;
  ariaLabel: string;
}

export const AY_SKELETON_LOADER_CONFIG =
  new InjectionToken<AySkeletonLoaderConfig>('ay-skeleton-loader.config');

export function provideAySkeletonLoader(
  config?: Partial<AySkeletonLoaderConfig>,
) {
  return makeEnvironmentProviders([
    { provide: AY_SKELETON_LOADER_CONFIG, useValue: config },
  ]);
}
