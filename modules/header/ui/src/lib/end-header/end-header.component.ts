import {
  GoogleSigninButtonModule,
  SocialUser,
} from '@abacritt/angularx-social-login';
import {
  SettingsButtonComponent,
  SvgButtonRendererComponent,
  SvgButtonTemplateDirective,
} from '@angular-youtube/shared-ui';
import { Overlay, OverlayConfig, OverlayModule } from '@angular/cdk/overlay';
import { CdkPortal, PortalModule } from '@angular/cdk/portal';
import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
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
    OverlayModule,
    PortalModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EndHeaderComponent {
  public user = input.required<SocialUser | undefined>();
  public isLoggedIn = computed(() => this.user() != null);
  public isOpenedAvatarMenu = signal(false);
  private portal = viewChild.required(CdkPortal);
  private avatarButton = viewChild.required('avatar', { read: ElementRef });
  private overlay = inject(Overlay);

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

  onClickAvatar() {
    const overlayRef = this.overlay.create(
      new OverlayConfig({
        positionStrategy: this.overlay
          .position()
          .flexibleConnectedTo(this.avatarButton())
          .withPositions([
            {
              originX: 'start',
              originY: 'top',
              overlayX: 'end',
              overlayY: 'top',
            },
          ]),
        scrollStrategy: this.overlay.scrollStrategies.reposition(),
        hasBackdrop: true,
        disposeOnNavigation: true,
      }),
    );
    overlayRef.attach(this.portal());
  }
}
