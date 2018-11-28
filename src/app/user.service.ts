import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import decode from 'jwt-decode';

import { MessageService } from './message.service';
import { User } from './user';
import {Metric} from './metric';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = environment.api_url + 'users';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  private log(message: string) {
    this.messageService.add(`VisitService: ${message}`);
  }

  getUsers(params?: HttpParams): Observable<User[]> {
    return this.http.get<User[]>(this.url, {params: params}).pipe(
      tap(users => this.log('fetched users')),
      catchError(this.handleError('getUsers', []))
    );
  }

  addUser(user: User) {
      return this.http.post(this.url, user, httpOptions).pipe(
      tap((newUser: User) => this.log(`added user w/ id=${newUser.id}`)),
      catchError(this.handleError<User>('addUser'))
    );
  }

  get logged(): boolean {
    return localStorage.getItem('access_token') !== null;
  }

  get isAdmin() {
    const access_token = localStorage.getItem('access_token');
    if (access_token) {
      return decode(access_token).admin;
    }
    return false;
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      return throwError(error);
    };
  }
}
