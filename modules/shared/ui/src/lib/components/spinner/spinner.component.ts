import { SpinnerService } from '@angular-youtube/shared-data-access';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
import { filter, tap } from 'rxjs';

@Component({
  selector: 'ay-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  imports: [MatProgressSpinnerModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.opacity]': 'opacity()',
    '[style.zIndex]': 'zIndex()',
  },
})
export class SpinnerComponent implements OnInit {
  detectRouteTransitions = input(false);
  spinnerService = inject(SpinnerService);
  router = inject(Router);
  opacity = computed(() => (this.spinnerService.isLoading() ? 1 : 0));
  zIndex = computed(() =>
    this.spinnerService.isLoading() ? 'var(--layer-2)' : '0',
  );

  ngOnInit() {
    if (this.detectRouteTransitions()) {
      this.router.events
        .pipe(
          filter(
            (event) =>
              event instanceof NavigationStart ||
              event instanceof NavigationEnd,
          ),
          // Use tap to perform side effects
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
