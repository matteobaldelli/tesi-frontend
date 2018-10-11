import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private url = environment.api_url + 'login/';

  constructor(private http: HttpClient) { }

  login(params: Object) {
      return this.http.post<Object>(this.url, params)
          .pipe(map(user => {
              // login successful if there's a jwt token in the response
              if (user && user['token']) {
                  // store user details and jwt token in local storage to keep user logged in between page refreshes
                  localStorage.setItem('currentUser', JSON.stringify(user));
              }

              return user;
          }));
  }

  logout() {
      // remove user from local storage to log user out
      localStorage.removeItem('currentUser');
  }
}
