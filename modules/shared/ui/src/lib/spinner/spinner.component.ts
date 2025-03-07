import { SpinnerService } from '@angular-youtube/shared-data-access';
import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  NavigationEnd,
  NavigationStart,
  Router,
  RouterModule,
} from '@angular/router';
import { tap } from 'rxjs';

@Component({
  selector: 'ay-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  imports: [MatProgressSpinnerModule, AsyncPipe, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent implements OnInit {
  detectRouteTransitions = input(false);
  spinnerService = inject(SpinnerService);
  router = inject(Router);
  loading$ = this.spinnerService.loading$;

  ngOnInit() {
    if (this.detectRouteTransitions()) {
      this.router.events
        .pipe(
          tap((event) => {
            if (event instanceof NavigationStart) {
              this.spinnerService.loadingOn();
            } else if (event instanceof NavigationEnd) {
              this.spinnerService.loadingOff();
            }
          }),
        )
        .subscribe();
    }
  }
}
