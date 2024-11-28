import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  HostListener,
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
})
export class RippleOnHoverDirective {
  elementRef = inject(ElementRef);
  ripple = inject(MatRipple);
  rippleRef: RippleRef | undefined;

  @HostListener('mouseenter')
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
  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.rippleRef?.fadeOut();
  }
}

@Component({
  selector: 'ay-svg-button-renderer',
  templateUrl: './svg-button-renderer.component.html',
  styleUrls: ['./svg-button-renderer.component.scss'],
  standalone: true,
  imports: [CommonModule, MatRippleModule, RippleOnHoverDirective],
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
  public fillRule = input<string>('nonZero');
}
