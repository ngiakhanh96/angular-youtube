import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TextIconButtonComponent } from '../text-icon-button/text-icon-button.component';

@Component({
  selector: 'ay-logo-renderer',
  templateUrl: './logo-renderer.component.html',
  styleUrls: ['./logo-renderer.component.scss'],
  imports: [TextIconButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoRendererComponent {}
