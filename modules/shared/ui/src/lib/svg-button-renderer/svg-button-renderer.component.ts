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
import { RippleOnHoverDirective } from '../directives/ripple-on-hover/ripple-on-hover.directive';

@Directive({ selector: '[aySvgButtonTmp]' })
export class SvgButtonTemplateDirective {
  template = inject<TemplateRef<unknown>>(TemplateRef);
}

/**
 * @deprecated Refactor to use [TextIconButtonComponent](../text-icon-button/text-icon-button.component.ts) component instead
 */
@Component({
  selector: 'ay-svg-button-renderer',
  templateUrl: './svg-button-renderer.component.html',
  styleUrls: ['./svg-button-renderer.component.scss'],
  imports: [CommonModule, MatRippleModule, RippleOnHoverDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgButtonRendererComponent {
  public avgButtonTmp = contentChild(SvgButtonTemplateDirective, {
    read: TemplateRef,
  });
  public rippleColor = input('rgb(0, 0, 0, 0.2)');
  public ariaLabel = input('');
  public viewBox = input<string | undefined>(undefined);
  public path = input('');
  public disabled = input<boolean>(false);
  public radius = input<number>(20);
  public opacity = input<number>(1);
  public fillRule = input<string>('nonZero');
  public fill = input('currentColor');
}
