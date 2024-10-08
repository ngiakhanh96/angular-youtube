import { MasterHeaderComponent } from '@angular-youtube/header-feature';
import { BrowseComponent } from '@angular-youtube/home-page-feature';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ay-layout',
  standalone: true,
  imports: [MasterHeaderComponent, BrowseComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {}
