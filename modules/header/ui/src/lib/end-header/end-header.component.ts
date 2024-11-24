import {
  GoogleSigninButtonModule,
  SocialUser,
} from '@abacritt/angularx-social-login';
import {
  SettingsButtonComponent,
  SvgButtonRendererComponent,
  SvgButtonTemplateDirective,
} from '@angular-youtube/shared-ui';
import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { LoginButtonComponent } from '../login-button/login-button.component';

declare global {
  interface Window {
    google: any;
  }
}

@Component({
  selector: 'ay-end-header',
  templateUrl: './end-header.component.html',
  styleUrls: ['./end-header.component.scss'],
  standalone: true,
  imports: [
    SvgButtonRendererComponent,
    GoogleSigninButtonModule,
    SvgButtonTemplateDirective,
    NgOptimizedImage,
    SettingsButtonComponent,
    LoginButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EndHeaderComponent {
  public user = input.required<SocialUser | null>();
  public isLoggedIn = computed(() => this.user() != null);

  onClickLogin() {
    const googleLoginWrapper = document.createElement('div');
    googleLoginWrapper.style.display = 'none';
    googleLoginWrapper.classList.add('custom-google-button');
    document.body.appendChild(googleLoginWrapper);
    window.google.accounts.id.renderButton(googleLoginWrapper, {
      type: 'icon',
      width: '200',
    });

    const googleLoginWrapperButton = googleLoginWrapper.querySelector(
      'div[role=button]',
    ) as HTMLElement;

    googleLoginWrapperButton.click();
  }
}
