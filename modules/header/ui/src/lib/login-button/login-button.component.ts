import { Auth } from '@angular-youtube/shared-data-access';
import { TextIconButtonComponent } from '@angular-youtube/shared-ui';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

@Component({
  selector: 'ay-login-button',
  templateUrl: './login-button.component.html',
  styleUrls: ['./login-button.component.scss'],
  imports: [TextIconButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginButtonComponent {
  public auth = inject(Auth);
  onClickLogin() {
    this.auth.login();
  }
}
