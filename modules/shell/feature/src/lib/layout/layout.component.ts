import { MasterHeaderComponent } from '@angular-youtube/shell-ui';
import { Component } from '@angular/core';
import { BrowseComponent } from '../browse/browse.component';

@Component({
  selector: 'ay-layout',
  standalone: true,
  imports: [MasterHeaderComponent, BrowseComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {}
