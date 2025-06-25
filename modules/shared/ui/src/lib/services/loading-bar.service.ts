import { computed, Injectable, signal } from '@angular/core';

// TODO bring this to store
@Injectable({
  providedIn: 'root',
})
export class LoadingBarService {
  private _loadingPercentage = signal(0);
  loadingPercentage = computed(() => this._loadingPercentage());

  load(percentage: number) {
    this._loadingPercentage.set(percentage);
  }
}
