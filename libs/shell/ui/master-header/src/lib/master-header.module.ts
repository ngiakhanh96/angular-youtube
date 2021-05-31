import { EndHeaderModule } from '@angular-youtube/shell/ui/end-header';
import { StartHeaderModule } from '@angular-youtube/shell/ui/start-header';
import { CenterHeaderModule } from '@angular-youtube/shell/ui/center-header';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterHeaderComponent } from './master-header.component';

@NgModule({
  imports: [
    CommonModule,
    StartHeaderModule,
    CenterHeaderModule,
    EndHeaderModule,
  ],
  exports: [MasterHeaderComponent],
  declarations: [MasterHeaderComponent],
})
export class MasterHeaderModule {}
