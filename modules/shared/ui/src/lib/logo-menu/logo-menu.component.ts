import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HamburgerButtonComponent } from '../hamburger-button/hamburger-button.component';
import { LogoRendererComponent } from '../logo-renderer/logo-renderer.component';

@Component({
    selector: 'ay-logo-menu',
    templateUrl: './logo-menu.component.html',
    styleUrls: ['./logo-menu.component.scss'],
    imports: [HamburgerButtonComponent, LogoRendererComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoMenuComponent {}
