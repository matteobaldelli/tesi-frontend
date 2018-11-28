import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

import { MessageService } from './message.service';

import { Visit } from './visit';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class VisitService {
  private url = environment.api_url + 'visits';

  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) { }

  private log(message: string) {
    this.messageService.add(`VisitService: ${message}`);
  }

  getVisits(params?: HttpParams): Observable<Visit[]> {
    return this.http.get<Visit[]>(this.url, {params: params}).pipe(
      tap(visits => this.log('fetched visits')),
      catchError(this.handleError('getVisits', []))
    );
  }

  getVisit(id: number): Observable<Visit> {
    return this.http.get<Visit>(this.url + '/' + id).pipe(
      tap(_ => this.log(`fetched visit id=${id}`)),
      catchError(this.handleError<Visit>(`getVisit id=${id}`))
    );
  }

  updateVisit(visit: Visit): Observable<any> {
    return this.http.put(this.url + '/' + visit.id, visit, httpOptions).pipe(
      tap(_ => this.log(`updated visit id=${visit.id}`)),
      catchError(this.handleError<any>('updateVisit'))
    );
  }

  addVisit(visit: Visit): Observable<Visit> {
    return this.http.post<Visit>(this.url, visit, httpOptions).pipe(
      tap((newVisit: Visit) => this.log(`added visit w/ id=${newVisit.id}`)),
      catchError(this.handleError<Visit>('addVisit'))
    );
  }

  deleteVisit(visit: Visit | number): Observable<Visit> {
    const id = typeof visit === 'number' ? visit : visit.id;
    return this.http.delete<Visit>(this.url + '/' + id, httpOptions).pipe(
      tap(_ => this.log(`deleted visit id=${id}`)),
      catchError(this.handleError<Visit>('deleteVisit'))
    );
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
