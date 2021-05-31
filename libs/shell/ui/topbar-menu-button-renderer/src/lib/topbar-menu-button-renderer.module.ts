import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TopbarMenuButtonRendererComponent,
  TopbarMenuButtonTemplateDirective,
} from './topbar-menu-button-renderer.component';

@NgModule({
  imports: [CommonModule],
  exports: [
    TopbarMenuButtonRendererComponent,
    TopbarMenuButtonTemplateDirective,
  ],
  declarations: [
    TopbarMenuButtonRendererComponent,
    TopbarMenuButtonTemplateDirective,
  ],
})
export class TopbarMenuButtonRendererModule {}
