import { MasterHeaderComponent } from '@angular-youtube/header-feature';
import { BrowseComponent } from '@angular-youtube/home-page-feature';
import { Component } from '@angular/core';

@Component({
  selector: 'ay-layout',
  standalone: true,
  imports: [MasterHeaderComponent, BrowseComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {}
