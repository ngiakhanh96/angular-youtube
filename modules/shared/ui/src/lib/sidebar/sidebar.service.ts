import { Injectable, signal } from '@angular/core';

// TODO bring this to store
@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  public isOpened = signal<boolean>(false);

  setState(state: boolean) {
    this.isOpened.set(state);
  }

  toggle() {
    this.isOpened.update((state) => !state);
  }
}
