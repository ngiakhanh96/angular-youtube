import {
  ButtonIconTemplateDirective,
  ButtonRendererComponent,
  ButtonTextTemplateDirective,
} from './button-renderer.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
  exports: [
    ButtonRendererComponent,
    ButtonIconTemplateDirective,
    ButtonTextTemplateDirective,
  ],
  declarations: [
    ButtonRendererComponent,
    ButtonIconTemplateDirective,
    ButtonTextTemplateDirective,
  ],
})
export class ButtonRendererModule {}
