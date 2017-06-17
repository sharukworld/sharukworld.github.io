import { Url } from '../constant/url';
import { Component } from '@angular/core';
import { CookieOptionsArgs, CookieService } from 'angular2-cookie/core';
import { UserModel } from 'Model/user.mode';
import { HttpService } from 'services/http-services/http.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor() {

  }
}
