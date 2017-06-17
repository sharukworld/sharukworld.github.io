import { Url } from '../constant/url';
import { Component } from '@angular/core';
import { CookieOptionsArgs, CookieService } from 'angular2-cookie/core';
import { UserModel } from 'Model/user.mode';
import { HttpService } from 'services/http-services/http.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [HttpService]
})
export class AppComponent {
  title = 'app';
  constructor(private httpService: HttpService, private cookieService: CookieService) {

  }
  url;
  password: string = '';
  
  
  fromDate: string = '';
  userDataObj:any = {
      username: '',
      jiraDomain:'',
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
    this.userDataObj = this.cookieService.getObject('jirKey');
  }
  // getAllUser() {
  //   let url = this.jiraDomain + Url.user + this.project;
  //   this.httpService.secureGet(url, this.username, this.password).subscribe(
  //     res => {
  //       this.userList = res.json();
  //     },
  //     err => {
  //     }
  //   );
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

  moreThan20Logs = [];
  getWorkLogFromTo() {
    this.setCookies();
   this.userList = [];
     let queryDate = (this.userDataObj.fromDate === '') ? this.todayDate : this.userDataObj.fromDate;
     this.userDataObj.fromDate = queryDate;
     let url = "http://jira-oc-services-jira-services.7e14.starter-us-west-2.openshiftapps.com//worklogs";
     this.httpService.securePost(url, this.userDataObj,  this.userDataObj.username, this.password).subscribe(
       res => {
         console.log('res', res.json());
         this.userList = res.json();
       }
     );
  //   let url = this.jiraDomain + Url.allTicketWorkLog + '&fields=key,summary,worklog&jql=project= ' + this.project + ' and updated >' + queryDate;
  //   this.httpService.secureGet(url, this.username, this.password).subscribe(
  //     res => {
  //       this.issues = res.json().issues;
  //       let lessThan21Logs = [];
  //       this.issues.forEach(el => {
  //         if (el.fields.worklog.total > 20) {
  //           this.moreThan20Logs.push(el);
  //         }
  //         else {
  //           lessThan21Logs.push(el);
  //         }
  //       });
  //       console.log('issues', this.issues);
  //       if (this.moreThan20Logs.length !== 0) {
  //         console.log('morethan20', this.moreThan20Logs);

          // for (let i = 0; i < this.moreThan20Logs.length; i++) {
          //   console.log('for', this.moreThan20Logs[i]);
          //   this.getIssueIndetail(this.moreThan20Logs[i].key).subscribe(
          //     res => {
          //       this.moreThan20Logs[i].fields.worklog = res.json();
          //       if (i === this.moreThan20Logs.length - 1) {
          //         this.issues = [];
          //         this.issues = this.issues.concat(this.moreThan20Logs).concat(lessThan21Logs);
          //         console.log('issues', this.issues);
          //         this.mapUserAndIssue(this.issues);
          //       }
          //     }
          //   );

          // }
  //       }
  //       else {
  //         this.mapUserAndIssue(this.issues);
  //       }

  //     },
  //     err => {
  //       console.error('err', err);
  //     }
  //   );
   }
  // tickets with more than 20 logs
  // mapUserAndIssue(issues) {
  //   console.log('issues', issues);
  //   issues.forEach(element => {
  //     element.fields.worklog.worklogs.forEach(el => {
  //       let user = this.userList.find(x => (x.accountId == el.author.accountId))
  //       if (user != null) {
  //         if (user.worklogs == null)
  //           user['worklogs'] = [];
  //         user.worklogs.push(el);
  //       }
  //       else {
  //         el.author['worklogs'] = [];
  //         el.author.worklogs.push(el);
  //         this.userList.push(el.author);
  //       }
  //     })
  //   });
  //   console.log('this.', this.userList);

  // }

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

  // getIssueIndetail(key) {
  //   let url = this.jiraDomain + Url.givenIssue + key + '/worklog';
  //   return this.httpService.secureGet(url, this.username, this.password);
  // }

  test(){
    let url = "http://localhost:8080/";
    let dataSend = this.userDataObj;
     let encryptData = this.userDataObj.user+':'+this.password;
     dataSend.encryptedData =  btoa(encryptData);
        return this.httpService.securePost(url,dataSend, this.userDataObj.user, this.password).subscribe(res => {
          console.log('res',res);
        });
  }
}
