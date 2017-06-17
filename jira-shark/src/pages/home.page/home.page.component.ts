import { Url } from '../../constant/url';
import { Component, ViewEncapsulation } from '@angular/core';
import { CookieOptionsArgs, CookieService } from 'angular2-cookie/core';
import { UserModel } from 'Model/user.mode';
import { HttpService } from 'services/http-services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IMyDrpOptions } from 'mydaterangepicker';
import { NotificationsService } from "angular2-notifications";
// import { LoadingAnimateService } from 'ng2-loading-animate';


@Component({
  selector: 'sw-jira-home',
  templateUrl: './home.page.component.html',
  styleUrls: ['./home.page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomePageComponent {
  constructor(private httpService: HttpService, private cookieService: CookieService, private _fb: FormBuilder,
    private _service: NotificationsService) {
  }
  isHttpCallOnProgress: boolean = false;
  public options = {
    position: ["bottom", "left"],
    timeOut: 5000,
    lastOnBottom: true,
    animate: 'scale'
  }
  private myDateRangePickerOptions: IMyDrpOptions = {
    // other options...
    dateFormat: 'yyyy-mm-dd',
    editableDateRangeField: false,
    openSelectorOnInputClick: true,
    height: '37px',
    width: '232px'

  };
  password: string = '';
  jiraDetailForm: FormGroup;
  userDataObj: any = {
    username: '',
    jiraDomain: '',
    project: '',
    fromDate: '',
    toDate: ''
  }
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
      'userName': [this.userDataObj.username, [Validators.required]],
      'password': [this.userDataObj.password, [Validators.required]],
      'jiraDomain': [this.userDataObj.jiraDomain, [Validators.required]],
      'project': [this.userDataObj.project, [Validators.required]],
      'fromDate': [this.userDataObj.fromDate, []],
    })

  }
  // start() {
  //   this._loadingSvc.setValue(true);
  // }
  // stop() {
  //   this._loadingSvc.setValue(false);
  // }

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
    // this.start();
    this.isHttpCallOnProgress = true;
    let body = document.getElementsByTagName('body')[0];
     body.classList.add("loaderBackGround");
    this.setCookies();
    this.userList = [];
    let url = Url.baseUrl + Url.worklog;
    if (this.userDataObj.fromDate == null) {
      this.userDataObj.fromDate = this.todayDate;
      this.userDataObj.toDate = ''
    }
    else if (this.userDataObj.fromDate.formatted != null) {
      let startDate = this.userDataObj.fromDate.formatted.slice(0, 10);
      let endDate = this.userDataObj.fromDate.formatted.slice(13, 23);
      this.userDataObj.fromDate = startDate;
      this.userDataObj.toDate = endDate;
    }
    this.httpService.securePost(url, this.userDataObj, this.userDataObj.username, this.password).subscribe(
      res => {

        this.userList = res.json().users;
        this.isHttpCallOnProgress = false;
        body.classList.remove("loaderBackGround");
        // this.stop();
        if (!res.json().isValid) {
          this._service.error('Login failed;', 'Invalid username, password, jiradomain or project.');
        }

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
