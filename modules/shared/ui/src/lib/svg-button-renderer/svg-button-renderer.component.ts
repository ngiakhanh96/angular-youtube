import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  TemplateRef,
  contentChild,
  inject,
  input,
} from '@angular/core';
import { MatRipple, MatRippleModule, RippleRef } from '@angular/material/core';

@Directive({ selector: '[aySvgButtonTmp]', standalone: true })
export class SvgButtonTemplateDirective {
  template = inject<TemplateRef<unknown>>(TemplateRef);
}

@Directive({
  selector: '[ayRippleOnHover]',
  standalone: true,
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class RippleOnHoverDirective {
  elementRef = inject(ElementRef);
  ripple = inject(MatRipple);
  rippleRef: RippleRef | undefined;

  onMouseEnter(): void {
    if (!this.ripple.disabled) {
      this.rippleRef = this.ripple.launch({
        ...this.ripple.rippleConfig,
        persistent: true,
        animation: {
          enterDuration: 0,
          exitDuration: 0,
        },
      });
    }
  }

  onMouseLeave(): void {
    this.rippleRef?.fadeOut();
  }
}

//TODO deprecated. Refactor to use TextIconButton component
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
