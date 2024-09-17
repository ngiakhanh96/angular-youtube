import { AsyncPipe, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  RouteConfigLoadEnd,
  RouteConfigLoadStart,
  Router,
  RouterModule,
} from '@angular/router';
import { tap } from 'rxjs';
import { SpinnerService } from './spinner.service';

@Component({
  selector: 'ay-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  imports: [
    MatProgressSpinnerModule,
    AsyncPipe,
    NgIf,
    NgTemplateOutlet,
    RouterModule,
  ],
  standalone: true,
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
            if (event instanceof RouteConfigLoadStart) {
              this.spinnerService.loadingOn();
            } else if (event instanceof RouteConfigLoadEnd) {
              this.spinnerService.loadingOff();
            }
          })
        )
        .subscribe();
    }
  }
}