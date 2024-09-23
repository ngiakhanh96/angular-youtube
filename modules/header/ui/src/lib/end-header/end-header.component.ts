import {
  GoogleSigninButtonModule,
  SocialUser,
} from '@abacritt/angularx-social-login';
import {
  ButtonIconTemplateDirective,
  ButtonRendererComponent,
  ButtonTextTemplateDirective,
} from '@angular-youtube/shared-ui';
import { NgOptimizedImage } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import {
  TopbarMenuButtonRendererComponent,
  TopbarMenuButtonTemplateDirective,
} from '../topbar-menu-button-renderer/topbar-menu-button-renderer.component';

@Component({
  selector: 'ay-end-header',
  templateUrl: './end-header.component.html',
  styleUrls: ['./end-header.component.scss'],
  standalone: true,
  imports: [
    TopbarMenuButtonRendererComponent,
    ButtonRendererComponent,
    GoogleSigninButtonModule,
    ButtonTextTemplateDirective,
    ButtonIconTemplateDirective,
    TopbarMenuButtonTemplateDirective,
    NgOptimizedImage,
  ],
})
export class EndHeaderComponent {
  public user = input.required<SocialUser | null>();
  public isLoggedIn = computed(() => this.user() != null);
}
