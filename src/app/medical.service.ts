import { Injectable } from '@angular/core';
import { Medical } from './medical';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MedicalService {
  private url = environment.api_url + 'medical';

  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) { }

  private log(message: string) {
    this.messageService.add(`MedicalService: ${message}`);
  }

  getMedicals(params: HttpParams): Observable<Medical[]> {
    return this.http.get<Medical[]>(this.url, {params: params}).pipe(
      tap(medicals => this.log('fetched visits')),
      catchError(this.handleError('getMedicals', []))
    );
  }

  addMedical(medical: Medical): Observable<Medical> {
    return this.http.post<Medical>(this.url, medical, httpOptions).pipe(
      tap((newMedical: Medical) => this.log(`added medical w/ id=${newMedical.id}`)),
      catchError(this.handleError<Medical>('addVisit'))
    );
  }

  deleteMedical(medical: Medical | number): Observable<Medical> {
    const id = typeof medical === 'number' ? medical : medical.id;
    return this.http.delete<Medical>(this.url + '/' + id, httpOptions).pipe(
      tap(_ => this.log(`deleted medical id=${id}`)),
      catchError(this.handleError<Medical>('deleteMedical'))
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

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
