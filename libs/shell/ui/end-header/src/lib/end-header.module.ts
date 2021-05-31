import { EndHeaderComponent } from './end-header.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopbarMenuButtonRendererModule } from '@angular-youtube/shell/ui/topbar-menu-button-renderer';
@NgModule({
  imports: [CommonModule, TopbarMenuButtonRendererModule],
  exports: [EndHeaderComponent],
  declarations: [EndHeaderComponent],
})
export class EndHeaderModule {}
