import { Platform } from '@angular/cdk/platform';
import { Injectable } from '@angular/core';
import { MemoryStorage } from './memory-storage.service';

@Injectable({
  providedIn: 'root',
})
export class SessionStorage implements Storage {
  private readonly storage: Storage;

  constructor(private _platform: Platform) {
    if (this._platform.isBrowser && window?.sessionStorage) {
      this.storage = window.sessionStorage;
    } else {
      this.storage = new MemoryStorage();
    }
  }

  get length(): number {
    return this.storage.length;
  }

  clear(): void {
    this.storage.clear();
  }

  getItem(key: string): string | null {
    return this.storage.getItem(key);
  }

  key(index: number): string | null {
    return this.storage.key(index);
  }

  removeItem(key: string): void {
    this.storage.removeItem(key);
  }

  setItem(key: string, value: string): void {
    this.storage.setItem(key, value);
  }
}
