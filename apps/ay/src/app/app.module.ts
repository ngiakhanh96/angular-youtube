import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ShellFeatureModule } from '@angular-youtube/shell/feature';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, ShellFeatureModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
