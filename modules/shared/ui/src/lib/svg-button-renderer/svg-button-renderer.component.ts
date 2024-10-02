import { CommonModule } from '@angular/common';
import {
  Component,
  Directive,
  TemplateRef,
  contentChild,
  inject,
  input,
} from '@angular/core';
import { MatRippleModule } from '@angular/material/core';

@Directive({ selector: '[ayTopbarMenuButtonTmp]', standalone: true })
export class SvgButtonTemplateDirective {
  template = inject<TemplateRef<unknown>>(TemplateRef);
}

@Component({
  selector: 'ay-svg-button-renderer',
  templateUrl: './svg-button-renderer.component.html',
  styleUrls: ['./svg-button-renderer.component.scss'],
  standalone: true,
  imports: [CommonModule, MatRippleModule],
})
export class SvgButtonRendererComponent {
  public avgButtonTmp = contentChild(SvgButtonTemplateDirective, {
    read: TemplateRef,
  });

  public ariaLabel = input('');
  public viewBox = input('');
  public path = input('');
}
