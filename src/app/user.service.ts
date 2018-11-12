import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = environment.api_url + 'users';

  constructor(private http: HttpClient) {}

  register(user: Object) {
      return this.http.post(this.url, user);
  }

  get logged() {
    return localStorage.getItem('access_token') !== null;
  }

  get isAdmin() {
    const access_token = localStorage.getItem('access_token');
    if (access_token) {
      return decode(access_token).admin;
    }
    return false;
  }
}
