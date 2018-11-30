import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private url = environment.api_url + 'login';

  constructor(private http: HttpClient) { }

  login(params: Object) {
      return this.http.post<Object>(this.url, params)
          .pipe(map(user => {
              if (user && user['access_token']) {
                  // store user details and jwt token in local storage to keep user logged in between page refreshes
                  localStorage.setItem('access_token', user['access_token']);
              }
              return user;
          }));
  }

  logout() {
      localStorage.removeItem('access_token');
  }
}
