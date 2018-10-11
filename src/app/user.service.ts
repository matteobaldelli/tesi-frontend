import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = environment.api_url + 'user/';

  constructor(private http: HttpClient) {}

  register(user: Object) {
      return this.http.post(this.url, user);
  }
}
