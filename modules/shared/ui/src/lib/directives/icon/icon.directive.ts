import { afterNextRender, Directive, inject, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

//TODO convert all icon to use mat-icon
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'mat-icon',
  standalone: true,
  host: {
    '[style.font-variation-settings]': 'fontVariationSettings()',
    '[style.fill]': 'fill()',
  },
})
export class IconDirective {
  host = inject(MatIcon);
  fontVariationSettings = input<string>("'FILL' 1");
  fill = input<string>('black');
  viewBox = input<string | undefined>(undefined);
  transform = input<string | undefined>(undefined);

  constructor() {
    afterNextRender({
      write: () => {
        if (this.viewBox() != null) {
          this.host._elementRef.nativeElement
            .getElementsByTagName('svg')[0]
            .setAttribute('viewBox', this.viewBox() as string);
        }
        if (this.transform() != null) {
          this.host._elementRef.nativeElement.style.transform =
            this.transform() as string;
        }
      },
    });
  }
}
