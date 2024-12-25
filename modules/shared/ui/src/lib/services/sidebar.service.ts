import { computed, Injectable, signal } from '@angular/core';

// TODO bring this to store
@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private _isOpened = signal<boolean>(false);
  public isOpened = computed(() => this._isOpened());
  private _showMiniSidebar = signal<boolean>(true);
  public showMiniSidebar = computed(() => this._showMiniSidebar());

  setState(state: boolean) {
    this._isOpened.set(state);
  }

  toggle() {
    this._isOpened.update((state) => !state);
  }

  setMiniSidebarState(state: boolean) {
    this._showMiniSidebar.set(state);
  }
}
