import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IconDirective } from '../directives/icon/icon.directive';

@Component({
  selector: 'ay-menu-section-header',
  imports: [MatIconModule, IconDirective],
  templateUrl: './menu-section-header.component.html',
  styleUrl: './menu-section-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuSectionHeaderComponent {
  displayText = input.required<string>();
  fontIcon = input<string>('');
}
