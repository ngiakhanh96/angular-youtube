import { SocialUser } from '@abacritt/angularx-social-login';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
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
  public user = input.required<SocialUser | undefined>();
}
