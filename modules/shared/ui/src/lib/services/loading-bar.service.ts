import { computed, Injectable, signal } from '@angular/core';

// TODO bring this to store
@Injectable({
  providedIn: 'root',
})
export class LoadingBarService {
  private _loadingPercentage = signal(0);
  loadingPercentage = computed(() => this._loadingPercentage());
  isLoading = computed(
    () => this.loadingPercentage() > 0 && this.loadingPercentage() < 100,
  );

  load(percentage: number) {
    this._loadingPercentage.set(percentage);
  }
}
