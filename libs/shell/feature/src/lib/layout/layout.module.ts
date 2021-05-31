import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { MasterHeaderModule } from '@angular-youtube/shell/ui/master-header';
@NgModule({
  imports: [CommonModule, MasterHeaderModule],
  exports: [LayoutComponent],
  providers: [],
  declarations: [LayoutComponent],
})
export class LayoutModule {}
