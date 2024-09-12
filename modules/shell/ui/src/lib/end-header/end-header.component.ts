import {
  GoogleSigninButtonModule,
  SocialAuthService,
  SocialUser,
} from '@abacritt/angularx-social-login';
import {
  ButtonIconTemplateDirective,
  ButtonRendererComponent,
  ButtonTextTemplateDirective,
} from '@angular-youtube/shared-ui';
import { NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
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
    NgIf,
    GoogleSigninButtonModule,
    ButtonTextTemplateDirective,
    ButtonIconTemplateDirective,
    TopbarMenuButtonTemplateDirective,
  ],
})
export class EndHeaderComponent implements OnInit {
  private store = inject(Store);
  private authService = inject(SocialAuthService);

  public user: SocialUser | null = null;

  public get isLoggedIn(): boolean {
    return this.user != null;
  }

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      console.log(user);
    });
  }
}
