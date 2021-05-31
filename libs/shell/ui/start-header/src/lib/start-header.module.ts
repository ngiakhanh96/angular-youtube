import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StartHeaderComponent } from './start-header.component';
import { IconButtonModule } from '@angular-youtube/shell/ui/icon-button';
import { TopbarLogoRendererModule } from '@angular-youtube/shell/ui/topbar-logo-renderer';

@NgModule({
  imports: [CommonModule, IconButtonModule, TopbarLogoRendererModule],
  declarations: [StartHeaderComponent],
  exports: [StartHeaderComponent],
})
export class StartHeaderModule {}
