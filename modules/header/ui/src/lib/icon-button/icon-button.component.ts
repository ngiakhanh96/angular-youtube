import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ay-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonComponent {}
