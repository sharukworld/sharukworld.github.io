import { HttpService } from '../services/http-services/http.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { HomePageComponent } from "pages/home.page/home.page.component";

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [{ provide: CookieService, useFactory: cookieServiceFactory }, HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
export function cookieServiceFactory() {
  return new CookieService();
}