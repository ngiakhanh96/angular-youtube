import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  TemplateRef,
  contentChild,
  inject,
  input,
} from '@angular/core';
import { MatRippleModule } from '@angular/material/core';

@Directive({ selector: '[aySvgButtonTmp]', standalone: true })
export class SvgButtonTemplateDirective {
  template = inject<TemplateRef<unknown>>(TemplateRef);
}

@Component({
  selector: 'ay-svg-button-renderer',
  templateUrl: './svg-button-renderer.component.html',
  styleUrls: ['./svg-button-renderer.component.scss'],
  standalone: true,
  imports: [CommonModule, MatRippleModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgButtonRendererComponent {
  public avgButtonTmp = contentChild(SvgButtonTemplateDirective, {
    read: TemplateRef,
  });

  public ariaLabel = input('');
  public viewBox = input('');
  public path = input('');
  public disabled = input<boolean>(false);
  public radius = input<number>(20);
  public opacity = input<number>(1);
}
