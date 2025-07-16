import { effect, inject, Injectable, Injector, OnDestroy } from '@angular/core';
import { Dispatcher, EventInstance } from '@ngrx/signals/events';
import { Subscription } from 'rxjs';
import { SharedStore } from '../store/base/reducers/shared.reducer';
import { SpinnerService } from './spinner.service';

@Injectable({
  providedIn: 'root',
})
export class SandboxService implements OnDestroy {
  public sharedStore = inject(SharedStore);
  protected injector = inject(Injector);
  protected dispatcher = inject(Dispatcher);
  private spinnerService = inject(SpinnerService);
  private subs: Subscription[] = [];
  constructor() {
    effect(() => {
      const response = this.sharedStore.getResponse();
      if (response.isPendingCount > 0) {
        this.spinnerService.loadingOn();
      } else {
        this.spinnerService.loadingOff();
      }
    });
  }

  getResponseDetailsSignal(event: EventInstance<string, any>) {
    return this.sharedStore.getResponseDetails$(event, {
      injector: this.injector,
    });
  }

  dispatchEvent(event: EventInstance<string, any>) {
    this.dispatcher.dispatch(event);
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
