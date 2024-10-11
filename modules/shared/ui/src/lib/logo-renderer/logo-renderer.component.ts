import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  SvgButtonRendererComponent,
  SvgButtonTemplateDirective,
} from '../svg-button-renderer/svg-button-renderer.component';

@Component({
  selector: 'ay-logo-renderer',
  templateUrl: './logo-renderer.component.html',
  styleUrls: ['./logo-renderer.component.scss'],
  standalone: true,
  imports: [SvgButtonRendererComponent, SvgButtonTemplateDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoRendererComponent {}
