import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ExternalNavigationService {
  private document = inject(DOCUMENT);
  private router = inject(Router);

  public navigateWithinAppWithoutLocationChange(externalUrl?: string) {
    if (externalUrl) {
      this.router.navigate(['/externalRedirect'], {
        state: { externalUrl: externalUrl },
        skipLocationChange: true,
      });
    }
  }

  public navigateByOpeningNewWindow(url?: string) {
    if (url) {
      this.document.defaultView?.open(url, '_blank')?.focus();
    }
  }

  public navigateByCurrentWindow(url?: string) {
    if (url) {
      this.document.defaultView?.open(url, '_self');
    }
  }
}
