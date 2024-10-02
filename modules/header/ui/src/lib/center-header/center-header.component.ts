import { SvgButtonRendererComponent } from '@angular-youtube/shared-ui';
import { Component } from '@angular/core';
import { SearchBoxComponent } from '../search-box/search-box.component';

@Component({
  selector: 'ay-center-header',
  templateUrl: './center-header.component.html',
  styleUrls: ['./center-header.component.scss'],
  standalone: true,
  imports: [SearchBoxComponent, SvgButtonRendererComponent],
})
export class CenterHeaderComponent {}
