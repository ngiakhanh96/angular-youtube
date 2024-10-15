import { Directive, inject, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

//TODO convert all icon to use mat-icon
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'mat-icon',
  standalone: true,
  host: {
    '[style.font-variation-settings]': 'fontVariationSettings()',
  },
})
export class IconDirective {
  host = inject(MatIcon);
  fontVariationSettings = input<string>("'FILL' 1");
}
