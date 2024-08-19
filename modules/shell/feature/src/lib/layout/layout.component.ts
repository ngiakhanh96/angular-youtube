import { MasterHeaderComponent } from '@angular-youtube/shell-ui';
import { Component } from '@angular/core';

@Component({
  selector: 'ay-layout',
  standalone: true,
  imports: [MasterHeaderComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {}
