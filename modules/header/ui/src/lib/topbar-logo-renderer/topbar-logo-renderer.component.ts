import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ay-topbar-logo-renderer',
  templateUrl: './topbar-logo-renderer.component.html',
  styleUrls: ['./topbar-logo-renderer.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopbarLogoRendererComponent {}
