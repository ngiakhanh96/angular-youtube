import {
  CenterHeaderComponent,
  EndHeaderComponent,
} from '@angular-youtube/header-ui';
import { selectMyChannelInfo } from '@angular-youtube/home-page-data-access';
import {
  Auth,
  BaseWithSandBoxComponent,
} from '@angular-youtube/shared-data-access';
import { LogoMenuComponent } from '@angular-youtube/shared-ui';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';

@Component({
    selector: 'ay-master-header',
    templateUrl: './master-header.component.html',
    styleUrls: ['./master-header.component.scss'],
    imports: [LogoMenuComponent, CenterHeaderComponent, EndHeaderComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[style.--logo-menu-width]': 'logoMenuWidth()',
    }
})
export class MasterHeaderComponent extends BaseWithSandBoxComponent {
  showStartHeader = input.required();
  authService = inject(Auth);
  logoMenuWidth = signal('236px');
  user = this.selectSignal(selectMyChannelInfo);
}
