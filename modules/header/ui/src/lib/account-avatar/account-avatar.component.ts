import {
  SvgButtonRendererComponent,
  SvgButtonTemplateDirective,
} from '@angular-youtube/shared-ui';
import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ay-account-avatar',
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
  public userThumbnail = input.required<string | undefined>();
  public height = input<number>(32);
  public width = input<number>(32);
}
