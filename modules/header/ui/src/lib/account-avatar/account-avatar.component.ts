import { SocialUser } from '@abacritt/angularx-social-login';
import {
  SvgButtonRendererComponent,
  SvgButtonTemplateDirective,
} from '@angular-youtube/shared-ui';
import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ay-account-avatar',
  standalone: true,
  imports: [
    SvgButtonRendererComponent,
    SvgButtonTemplateDirective,
    NgOptimizedImage,
  ],
  templateUrl: './account-avatar.component.html',
  styleUrl: './account-avatar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountAvatarComponent {
  public user = input.required<SocialUser | undefined>();
}
