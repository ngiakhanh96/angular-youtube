import { GoogleSigninButtonModule, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getUser, signInSuccess, signOut } from '@angular-youtube/shell-data-access';
import { TopbarMenuButtonRendererComponent, TopbarMenuButtonTemplateDirective } from "../topbar-menu-button-renderer/topbar-menu-button-renderer.component";
import { ButtonIconTemplateDirective, ButtonRendererComponent, ButtonTextTemplateDirective } from '@angular-youtube/shared-ui';
import { NgIf } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
    TopbarMenuButtonTemplateDirective]
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
      this.store.dispatch(signInSuccess({
        user: user,
      }));
      console.log(user);
    });
    this.store.select(getUser).subscribe(user => {
      this.user = user;
    });
  }

  public signOut(): void {
    this.store.dispatch(signOut());
  }

  // public refreshToken(): void {
  //   this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  // }
}
