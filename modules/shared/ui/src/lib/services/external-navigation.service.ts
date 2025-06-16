import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, DOCUMENT } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ExternalNavigationService {
  private document = inject(DOCUMENT);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  public navigateWithinAppWithoutLocationChange(externalUrl?: string) {
    if (externalUrl) {
      this.router.navigate(['/externalRedirect'], {
        state: { externalUrl: externalUrl },
        skipLocationChange: true,
      });
    }
  }

  public navigateByOpeningNewWindow(url?: string) {
    if (url && isPlatformBrowser(this.platformId)) {
      const newWindow = this.document.defaultView?.open(url, '_blank');
      if (newWindow) {
        newWindow.focus();
      }
    }
  }

  public navigateByCurrentWindow(url?: string) {
    if (url && isPlatformBrowser(this.platformId)) {
      this.document.defaultView?.open(url, '_self');
    }
  }
}
