import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ay-external',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalComponent {}
