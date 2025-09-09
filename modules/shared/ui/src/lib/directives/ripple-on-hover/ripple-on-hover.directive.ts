import { Directive, ElementRef, inject, input } from '@angular/core';
import { MatRipple, RippleRef } from '@angular/material/core';

@Directive({
  selector: '[ayRippleOnHover]',
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class RippleOnHoverDirective {
  enable = input<boolean>(true, { alias: 'ayRippleOnHover' });
  elementRef = inject(ElementRef);
  ripple = inject(MatRipple);
  rippleRef: RippleRef | undefined;

  onMouseEnter(): void {
    if (!this.ripple.disabled && this.enable()) {
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
