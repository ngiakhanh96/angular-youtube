import { computed, Injectable, signal } from '@angular/core';

// TODO bring this to store
@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private internalLoading = signal(false);
  loading = computed(() => this.internalLoading());

  loadingOn() {
    this.internalLoading.set(true);
  }

  loadingOff() {
    this.internalLoading.set(false);
  }

  toggle() {
    this.internalLoading.update((v) => !v);
  }
}
