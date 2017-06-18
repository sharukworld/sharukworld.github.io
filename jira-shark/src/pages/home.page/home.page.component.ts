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
  selectedUser;
  attemptedToFetchWorklogs = false;
  view = 'allUserView';
  public options = {
    position: ["bottom", "left"],
    timeOut: 5000,
    lastOnBottom: true,
    animate: 'scale'
  }
  private myDateRangePickerOptions: IMyDrpOptions = {
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
    let cookies = this.cookieService.getObject('jirKey');
    if (cookies != null)
      this.userDataObj = cookies;
      this.today.setHours(0, 0, 0, 0);
      this.todayDate = (this.today).toLocaleString('en-GB').slice(0, 10).split("\/").reverse().join("-");
    this.jiraDetailForm = this._fb.group({
      'userName': [this.userDataObj.username, [Validators.required]],
      'password': [this.userDataObj.password, [Validators.required]],
      'jiraDomain': [this.userDataObj.jiraDomain, [Validators.required]],
      'project': [this.userDataObj.project, [Validators.required]],
      'fromDate': [this.userDataObj.fromDate, []],
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
    this.attemptedToFetchWorklogs = true;
    this.isHttpCallOnProgress = true;
     this.view = 'allUserView';
    let body = document.getElementsByTagName('body')[0];
     body.classList.add("loaderBackGround");
    this.setCookies();
    this.userList = [];
    let url = Url.baseUrl + Url.worklog;
    if (this.userDataObj.fromDate.formatted == null) {
      let today = new Date();
      today.setHours(0, 0, 0, 0);
      let todayDate = (today).toLocaleString('en-GB').slice(0, 10).split("\/").reverse().join("-");
      today.setDate(today.getDate()+1);
      let nextDay = (today).toLocaleString('en-GB').slice(0, 10).split("\/").reverse().join("-");
      this.userDataObj.fromDate = todayDate;
      this.userDataObj.toDate = nextDay;
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
        if (!res.json().isValid) {
          this._service.error(res.json().errorHeader, res.json().errorMessage);
        }

      },
      err => {
        body.classList.remove("loaderBackGround");
        this.isHttpCallOnProgress = false;
        this._service.error('Unexpected error occured', 'Contact admin');
      }
    );
  }
  selectUser(user){
    this.view = 'specificUserView';
    this.selectedUser = user;
    console.log('user', user);
  }

}
