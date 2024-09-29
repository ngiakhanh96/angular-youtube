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
export class TopbarMenuButtonTemplateDirective {
  template = inject<TemplateRef<unknown>>(TemplateRef);
}

@Component({
  selector: 'ay-topbar-menu-button-renderer',
  templateUrl: './topbar-menu-button-renderer.component.html',
  styleUrls: ['./topbar-menu-button-renderer.component.scss'],
  standalone: true,
  imports: [CommonModule, MatRippleModule],
})
export class TopbarMenuButtonRendererComponent {
  public topbarMenuButtonTmp = contentChild(TopbarMenuButtonTemplateDirective, {
    read: TemplateRef,
  });

  public ariaLabel = input('');
  public viewBox = input('');
  public path = input('');
}
