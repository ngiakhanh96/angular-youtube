import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { extModules } from './build-specifics';
import { RouterModule } from '@angular/router';
import { shellRoutes } from './shell-feature.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(shellRoutes, {
      scrollPositionRestoration: 'top',
    }),
    ...extModules,
  ],
  exports: [RouterModule],
  providers: [],
  declarations: [],
})
export class ShellFeatureModule {}
