import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { extModules } from './build-specifics';
import { RouterModule } from '@angular/router';
import { shellRoutes } from './shell-feature.routes';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { LayoutModule } from './layout/layout.module';

@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    RouterModule.forRoot(shellRoutes, {
      scrollPositionRestoration: 'top',
    }),
    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot([]),
    ...extModules,
  ],
  exports: [RouterModule],
  providers: [],
  declarations: [],
})
export class ShellFeatureModule {}
