import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { LogoRendererComponent } from '../logo-renderer/logo-renderer.component';

@Component({
  selector: 'ay-logo-menu',
  templateUrl: './logo-menu.component.html',
  styleUrls: ['./logo-menu.component.scss'],
  standalone: true,
  imports: [IconButtonComponent, LogoRendererComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoMenuComponent {}
