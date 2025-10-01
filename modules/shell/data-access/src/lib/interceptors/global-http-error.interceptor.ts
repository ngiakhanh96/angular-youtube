import type {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { retry, timer } from 'rxjs';

export const globalHttpErrorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  return next(req).pipe(
    // Exponential backoff retry strategy for transient errors
    retry({
      count: 3,
      delay: (_error, retryIndex) => {
        const interval = 400;
        const delay = Math.pow(2, retryIndex - 1) * interval;
        return timer(delay);
      },
    }),
  );
};
