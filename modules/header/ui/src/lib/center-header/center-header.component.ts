import { SvgButtonRendererComponent } from '@angular-youtube/shared-ui';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SearchBoxComponent } from '../search-box/search-box.component';

@Component({
  selector: 'ay-center-header',
  templateUrl: './center-header.component.html',
  styleUrls: ['./center-header.component.scss'],
  standalone: true,
  imports: [SearchBoxComponent, SvgButtonRendererComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CenterHeaderComponent {}
