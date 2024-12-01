import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { Auth } from '@angular-youtube/shared-data-access';
import { IconDirective } from '@angular-youtube/shared-ui';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

declare global {
  interface Window {
    google: any;
  }
}

@Component({
  selector: 'ay-login-button',
  templateUrl: './login-button.component.html',
  styleUrls: ['./login-button.component.scss'],
  standalone: true,
  imports: [
    GoogleSigninButtonModule,
    MatButtonModule,
    MatIconModule,
    IconDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginButtonComponent {
  public auth = inject(Auth);
  onClickLogin() {
    this.auth.login();
  }
}
