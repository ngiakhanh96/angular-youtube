import {
  SvgButtonRendererComponent,
  SvgButtonTemplateDirective,
} from '@angular-youtube/shared-ui';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ay-topbar-logo-renderer',
  templateUrl: './topbar-logo-renderer.component.html',
  styleUrls: ['./topbar-logo-renderer.component.scss'],
  standalone: true,
  imports: [SvgButtonRendererComponent, SvgButtonTemplateDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopbarLogoRendererComponent {}
