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
    this.auth.getAccessToken();
    // const googleLoginWrapper = document.createElement('div');
    // googleLoginWrapper.style.display = 'none';
    // googleLoginWrapper.classList.add('custom-google-button');
    // document.body.appendChild(googleLoginWrapper);
    // window.google.accounts.id.renderButton(googleLoginWrapper, {
    //   type: 'icon',
    //   width: '200',
    // });

    // const googleLoginWrapperButton = googleLoginWrapper.querySelector(
    //   'div[role=button]',
    // ) as HTMLElement;

    // googleLoginWrapperButton.click();
  }
}
