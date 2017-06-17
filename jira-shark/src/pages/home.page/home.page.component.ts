import { Url } from '../../constant/url';
import { Component } from '@angular/core';
import { CookieOptionsArgs, CookieService } from 'angular2-cookie/core';
import { UserModel } from 'Model/user.mode';
import { HttpService } from 'services/http-services/http.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';



@Component({
  selector: 'sw-jira-home',
  templateUrl: './home.page.component.html',
  styleUrls: ['./home.page.component.css']
})
export class HomePageComponent {
  title = 'app';
  constructor(private httpService: HttpService, private cookieService: CookieService, private _fb: FormBuilder) {

  }
  url;
  password: string = '';
  jiraDetailForm: FormGroup;
  fromDate: string = '';
  userDataObj: any = {
    username: '',
    jiraDomain: '',
    project: '',
    fromDate: '',
    toDate: ''
  }
  toDate: string;
  userList: UserModel[] = [];
  issues = [];
  today = new Date();
  todayDate = '';
  ngOnInit() {
    this.today.setHours(0, 0, 0, 0);
    this.todayDate = (this.today).toLocaleString('en-GB').slice(0, 10).split("\/").reverse().join("-");
    let cookies = this.cookieService.getObject('jirKey');
    if (cookies != null)
      this.userDataObj = cookies;

    this.jiraDetailForm = this._fb.group({
      'userName' : [this.userDataObj.username, [Validators.required]],
      'password' : [this.userDataObj.password, [Validators.required]],
      'jiraDomain' : [this.userDataObj.jiraDomain, [Validators.required]],
      'project' : [this.userDataObj.project, [Validators.required]],
      'fromDate' : [this.userDataObj.fromDate, []],
    })
    
  }

  setCookies() {
    let date = this.today;
    let year = this.today.getFullYear() + 20;
    date.setUTCFullYear(year);
    let opts: CookieOptionsArgs = {
      expires: date
    };
    this.cookieService.putObject('jirKey', this.userDataObj, opts);
  }

  getWorkLogFromTo() {
    this.setCookies();
    this.userList = [];
    let queryDate = (this.userDataObj.fromDate === '') ? this.todayDate : this.userDataObj.fromDate;
    this.userDataObj.fromDate = queryDate;
    let url = Url.baseUrl+Url.worklog;
    this.httpService.securePost(url, this.userDataObj, this.userDataObj.username, this.password).subscribe(
      res => {
        console.log('res', res.json());
        this.userList = res.json();
      }
    );
  }

  calculateTime(worklogs) {
    if (worklogs == null || worklogs.length === 0)
      return 0;
    let timeInSecond = 0;
    worklogs.forEach(el => {
      let date = new Date(el.updated);
      let queryDate = (this.userDataObj.fromDate === '') ? this.todayDate : this.userDataObj.fromDate;
      let fromDateCompare = new Date(queryDate + ' 00:00:00');
      if (date >= fromDateCompare)
        timeInSecond += el.timeSpentSeconds;
    });
    return timeInSecond / (60 * 60);
  }
}
