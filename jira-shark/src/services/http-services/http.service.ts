import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

@Injectable()
export class HttpService {

    constructor(private http: Http) { }

    secureGet(url, user, password) {
        let sentData = user + ':' + password;
        let authHeader = btoa(sentData);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Basic ' +
            authHeader);
        return this.http.get(url, {
            headers: headers
        });
    }
    securePost(url, data, userName, password) {
        data.encryptedData = this.getToken(userName, password);
        return this.http.post(url, data);
    }
    getToken(userName, password) {
        let sentData = userName + ':' + password;
        return btoa(sentData);
    }
}