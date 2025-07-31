import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

// TODO bring this to store
@Injectable({
  providedIn: 'root',
})
export class PipService {
  router = inject(Router);
  private _originalVideoUrl?: string;

  setOriginalVideoUrl(url: string) {
    this._originalVideoUrl = url;
  }

  getOriginalVideoUrl(): string | undefined {
    return this._originalVideoUrl;
  }

  registerLeavePictureInPicture(prefix: string) {
    const originalVideoUrl = this.getOriginalVideoUrl();
    if (!this.router.url.includes(prefix) && originalVideoUrl) {
      this.router.navigateByUrl(originalVideoUrl);
    }
  }
}
