import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: Error | HttpErrorResponse): void {
    if (error instanceof HttpErrorResponse) {
      // Handle HTTP errors
      console.error('HTTP Error occurred:', {
        status: error.status,
        statusText: error.statusText,
        url: error.url,
        message: error.message,
      });
      // You can add custom error handling here, such as:
      // - Showing error notifications
      // - Logging to an error tracking service
      // - Redirecting to an error page
    } else {
      // Handle other errors
      console.error('An error occurred:', error);
      console.error('Stack trace:', error.stack);
    }
  }
}
