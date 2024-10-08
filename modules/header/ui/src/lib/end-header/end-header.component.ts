import {
  GoogleSigninButtonModule,
  SocialUser,
} from '@abacritt/angularx-social-login';
import {
  ButtonIconTemplateDirective,
  ButtonRendererComponent,
  ButtonTextTemplateDirective,
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

@Component({
  selector: 'ay-end-header',
  templateUrl: './end-header.component.html',
  styleUrls: ['./end-header.component.scss'],
  standalone: true,
  imports: [
    SvgButtonRendererComponent,
    ButtonRendererComponent,
    GoogleSigninButtonModule,
    ButtonTextTemplateDirective,
    ButtonIconTemplateDirective,
    SvgButtonTemplateDirective,
    NgOptimizedImage,
    SettingsButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EndHeaderComponent {
  public user = input.required<SocialUser | null>();
  public isLoggedIn = computed(() => this.user() != null);
}
