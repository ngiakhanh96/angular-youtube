import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { MasterHeaderModule } from '@angular-youtube/shell/ui/master-header';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import {
  featuredUserStateKey,
  featuredUserStateReducer,
  UserEffect,
} from '@angular-youtube/shell/data-access';
@NgModule({
  imports: [
    CommonModule,
    MasterHeaderModule,
    StoreModule.forFeature(featuredUserStateKey, featuredUserStateReducer),
    EffectsModule.forFeature([UserEffect]),
  ],
  exports: [LayoutComponent],
  providers: [],
  declarations: [LayoutComponent],
})
export class LayoutModule {}
