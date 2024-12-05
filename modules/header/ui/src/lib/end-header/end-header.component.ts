import { IMyChannelInfo } from '@angular-youtube/shared-data-access';
import {
  OverlayDirective,
  SettingsButtonComponent,
  SvgButtonRendererComponent,
  SvgButtonTemplateDirective,
} from '@angular-youtube/shared-ui';
import {
  ConnectedPosition,
  Overlay,
  OverlayModule,
} from '@angular/cdk/overlay';
import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { AccountMenuComponent } from '../account-menu/account-menu.component';
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
  imports: [
    SvgButtonRendererComponent,
    SvgButtonTemplateDirective,
    NgOptimizedImage,
    SettingsButtonComponent,
    LoginButtonComponent,
    OverlayModule,
    AccountMenuComponent,
    OverlayDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EndHeaderComponent {
  public user = input.required<IMyChannelInfo | undefined>();
  public userThumbnail = computed(
    () => this.user()?.items[0].snippet.thumbnails.default.url,
  );
  public isLoggedIn = computed(() => this.user() != null);
  public isOpenedAvatarMenu = signal(false);
  public scrollStrategy = signal(inject(Overlay).scrollStrategies.reposition());
  public overlayPositions = signal<ConnectedPosition[]>([
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
    },
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'top',
    },
  ]);

  onClickAvatar() {
    this.isOpenedAvatarMenu.update((v) => !v);
  }

  onOverlayOutsideClick() {
    this.isOpenedAvatarMenu.update((v) => !v);
  }
}
