import { computed, Injectable, signal } from '@angular/core';

// TODO bring this to store
@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private internalIsLoading = signal(false);
  isLoading = computed(() => this.internalIsLoading());

  loadingOn() {
    this.internalIsLoading.set(true);
  }

  loadingOff() {
    this.internalIsLoading.set(false);
  }

  toggle() {
    this.internalIsLoading.update((v) => !v);
  }
}
