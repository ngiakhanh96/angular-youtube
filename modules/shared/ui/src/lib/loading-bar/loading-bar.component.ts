import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { LoadingBarService } from '../services/loading-bar.service';

@Component({
  selector: 'ay-loading-bar',
  standalone: true,
  templateUrl: './loading-bar.component.html',
  styleUrls: ['./loading-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingBarComponent implements OnInit {
  loading = signal(false);
  loadingBarService = inject(LoadingBarService);
  opacity = computed(() =>
    this.loadingBarService.loadingPercentage() === 100 ||
    this.loadingBarService.loadingPercentage() === 0
      ? 0
      : 1,
  );
  private router = inject(Router);

  ngOnInit(): void {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.loadingBarService.load(25);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loadingBarService.load(100);
      }
    });
  }
}
