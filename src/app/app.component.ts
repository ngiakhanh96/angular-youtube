import { SpinnerComponent } from '@angular-youtube/shared-ui';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

//TODO upgrade to angular 19
@Component({
    imports: [RouterModule, SpinnerComponent],
    selector: 'ay-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'angular-youtube';
}
