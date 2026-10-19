import { SpinnerService } from '@angular-youtube/shared-data-access';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterModule,
} from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'ay-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  imports: [MatProgressSpinnerModule, RouterModule],
  host: {
    '[style.opacity]': 'opacity()',
    '[style.zIndex]': 'zIndex()',
  },
})
export class SpinnerComponent implements OnInit {
  detectRouteTransitions = input(false);
  spinnerService = inject(SpinnerService);
  router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
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
              event instanceof NavigationEnd ||
              event instanceof NavigationCancel ||
              event instanceof NavigationError,
          ),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe((event) => {
          if (event instanceof NavigationStart) {
            this.spinnerService.loadingOn();
          } else {
            this.spinnerService.loadingOff();
          }
        });
    }
  }
}
