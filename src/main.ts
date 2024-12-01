import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { csrConfig } from './app/app.config';

bootstrapApplication(AppComponent, csrConfig).catch((err) =>
  console.error(err),
);
