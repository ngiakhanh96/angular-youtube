import { RouteData } from '@angular-youtube/shared-data-access';
import {
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  OnInit,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ActivatedRoute,
  ChildActivationEnd,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { distinctUntilChanged, EMPTY, filter, switchMap, timer } from 'rxjs';
import { LoadingBarService } from '../../services/loading-bar.service';

@Component({
  selector: 'ay-loading-bar',
  templateUrl: './loading-bar.component.html',
  styleUrls: ['./loading-bar.component.scss'],
})
export class LoadingBarComponent implements OnInit {
  detectRouteTransitions = input(true);
  loadingBarService = inject(LoadingBarService);
  route = inject(ActivatedRoute);
  opacity = computed(() =>
    this.loadingBarService.loadingPercentage() === 100 ||
    this.loadingBarService.loadingPercentage() === 0
      ? 0
      : 1,
  );
  private router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  loadingBarRef = viewChild.required<ElementRef<HTMLDivElement>>('loadingBar');

  constructor() {
    let lastWidth = 0;
    effect(() => {
      const el = this.loadingBarRef().nativeElement;
      const currentWidth = this.loadingBarService.loadingPercentage();
      if (currentWidth > lastWidth && lastWidth !== 0 && lastWidth !== 100) {
        el.style.transition =
          'width 0.8s ease-in, opacity 0.6s ease-in-out 0.8s';
      } else {
        el.style.transition = 'none';
      }
      lastWidth = currentWidth;
    });
  }

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(
          (event) =>
            event instanceof ChildActivationEnd ||
            event instanceof NavigationStart ||
            event instanceof NavigationEnd ||
            event instanceof NavigationCancel ||
            event instanceof NavigationError,
        ),
        distinctUntilChanged(
          (prev, curr) => prev.constructor === curr.constructor,
        ),
        switchMap((event) => {
          if (!this.detectRouteTransitions()) {
            return EMPTY;
          }
          if (
            event instanceof NavigationCancel ||
            event instanceof NavigationError
          ) {
            this.loadingBarService.load(100);
            return EMPTY;
          }

          if (this.getLeafComponentData().detectRouteTransitions === false) {
            return EMPTY;
          }

          if (event instanceof ChildActivationEnd) {
            this.loadingBarService.load(25);
          } else if (event instanceof NavigationEnd) {
            return timer(1000);
          }
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.loadingBarService.load(100));
  }

  private getLeafComponentData() {
    let currentRoute = this.route.snapshot;
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }
    return currentRoute.data as RouteData;
  }
}
