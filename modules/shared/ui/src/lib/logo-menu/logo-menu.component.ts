import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HamburgerButtonComponent } from '../hamburger-button/hamburger-button.component';
import { LogoRendererComponent } from '../logo-renderer/logo-renderer.component';

@Component({
  selector: 'ay-logo-menu',
  templateUrl: './logo-menu.component.html',
  styleUrls: ['./logo-menu.component.scss'],
  standalone: true,
  imports: [HamburgerButtonComponent, LogoRendererComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoMenuComponent {}
