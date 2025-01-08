import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ExternalNavigationService {
  private document = inject(DOCUMENT);
  public navigateByOpeningNewWindow(url: string) {
    this.document.defaultView?.open(url, '_blank')?.focus();
  }

  public navigateByCurrentWindow(url: string) {
    this.document.defaultView?.open(url, '_self');
  }
}
