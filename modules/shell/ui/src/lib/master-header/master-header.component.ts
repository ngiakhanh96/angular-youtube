import { SocialAuthService } from '@abacritt/angularx-social-login';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CenterHeaderComponent } from '../center-header/center-header.component';
import { EndHeaderComponent } from '../end-header/end-header.component';
import { StartHeaderComponent } from '../start-header/start-header.component';

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
