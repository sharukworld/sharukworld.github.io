import { Injectable } from '@angular/core';
import { Http, Response , Headers} from '@angular/http';

@Injectable()
export class HttpService {

    constructor(private http: Http) { }
 
    secureGet(url,user,password){
    let sentData = user+':'+password;
    let authHeader = btoa(sentData);
     let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Basic ' +
                authHeader);
        //    headers.append('Access-Control-Allow-Origin','*');
        //    headers.append('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, authorization, Access-Control-Allow-Headers", "Content-Type, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version, X-File-Name');
        //    headers.append('Access-Control-Expose-Headers','GET, POST, OPTIONS, PUT, PATCH, DELETE');
        //    headers.append("Access-Control-Allow-Credentials", "true");
        //    headers.append('Access-Control-Max-Age','3628800');

                 return this.http.get(url, {
                headers: headers
            });
    }
}