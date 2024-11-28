import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ay-overlay-container',
  templateUrl: './overlay-container.component.html',
  styleUrls: ['./overlay-container.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    ['style.overflow']: 'hidden',
  },
})
export class OverlayContainerComponent {}
