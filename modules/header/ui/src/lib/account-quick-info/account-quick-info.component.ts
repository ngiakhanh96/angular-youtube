import { IMyChannelInfo } from '@angular-youtube/shared-data-access';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { AccountAvatarComponent } from '../account-avatar/account-avatar.component';

@Component({
  selector: 'ay-account-quick-info',
  standalone: true,
  imports: [AccountAvatarComponent],
  templateUrl: './account-quick-info.component.html',
  styleUrl: './account-quick-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountQuickInfoComponent {
  public user = input.required<IMyChannelInfo | undefined>();
  userThumbnail = computed(
    () => this.user()?.items[0].snippet.thumbnails.default.url,
  );
  userName = computed(() => this.user()?.items[0].snippet.title);
  userId = computed(() => this.user()?.items[0].snippet.customUrl);
}
