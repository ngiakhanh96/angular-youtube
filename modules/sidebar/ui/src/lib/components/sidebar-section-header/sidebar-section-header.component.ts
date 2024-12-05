import { IconDirective } from '@angular-youtube/shared-ui';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'ay-sidebar-section-header',
    imports: [MatIconModule, IconDirective],
    templateUrl: './sidebar-section-header.component.html',
    styleUrl: './sidebar-section-header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarSectionHeaderComponent {
  displayText = input.required<string>();
  fontIcon = input<string>('');
}
