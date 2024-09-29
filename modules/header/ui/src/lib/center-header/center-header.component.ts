import { Component } from '@angular/core';
import { SearchBoxComponent } from '../search-box/search-box.component';
import { TopbarMenuButtonRendererComponent } from '../topbar-menu-button-renderer/topbar-menu-button-renderer.component';

@Component({
  selector: 'ay-center-header',
  templateUrl: './center-header.component.html',
  styleUrls: ['./center-header.component.scss'],
  standalone: true,
  imports: [SearchBoxComponent, TopbarMenuButtonRendererComponent],
})
export class CenterHeaderComponent {}
