import { Component, OnInit } from '@angular/core';
import { SocialUser } from 'angularx-social-login';
import { Store } from '@ngrx/store';
import { getUser, signIn, signOut } from '@angular-youtube/shell/data-access';

@Component({
  selector: 'ay-end-header',
  templateUrl: './end-header.component.html',
  styleUrls: ['./end-header.component.scss'],
})
export class EndHeaderComponent implements OnInit {
  user$ = this.store.select(getUser);

  constructor(private store: Store) {}

  public user: SocialUser | null = null;

  public get isLoggedIn(): boolean {
    return this.user != null;
  }

  ngOnInit() {
    this.user$.subscribe((user) => {
      this.user = user;
      console.log(user);
    });
  }

  public signInWithGoogle(): void {
    this.store.dispatch(signIn());
  }

  public signOut(): void {
    this.store.dispatch(signOut());
  }

  // public refreshToken(): void {
  //   this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  // }
}
