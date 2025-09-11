import { ImageComponent } from '@angular-youtube/shared-ui';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ay-account-avatar',
  imports: [ImageComponent],
  templateUrl: './account-avatar.component.html',
  styleUrl: './account-avatar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountAvatarComponent {
  public userThumbnail = input.required<string | undefined>();
  public height = input<number>(32);
  public width = input<number>(32);
}
