import { SocialAuthService } from '@abacritt/angularx-social-login';
import {
  CenterHeaderComponent,
  EndHeaderComponent,
  StartHeaderComponent,
} from '@angular-youtube/header-ui';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
@Component({
  selector: 'ay-master-header',
  templateUrl: './master-header.component.html',
  styleUrls: ['./master-header.component.scss'],
  standalone: true,
  imports: [
    StartHeaderComponent,
    CenterHeaderComponent,
    EndHeaderComponent,
    AsyncPipe,
  ],
})
export class MasterHeaderComponent {
  protected authService = inject(SocialAuthService);
}
