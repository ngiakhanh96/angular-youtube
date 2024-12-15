import { Auth } from '@angular-youtube/shared-data-access';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TextIconButtonComponent } from '../text-icon-button/text-icon-button.component';

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
