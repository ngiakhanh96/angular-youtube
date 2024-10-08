import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { TopbarLogoRendererComponent } from '../topbar-logo-renderer/topbar-logo-renderer.component';

@Component({
  selector: 'ay-start-header',
  templateUrl: './start-header.component.html',
  styleUrls: ['./start-header.component.scss'],
  standalone: true,
  imports: [IconButtonComponent, TopbarLogoRendererComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartHeaderComponent {}
