import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { Metric } from './metric';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MetricsService {
  private url = environment.api_url + 'metrics';

  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) { }

  private log(message: string) {
    this.messageService.add(`MetricService: ${message}`);
  }

  getDataMetrics(): Observable<Object[]> {
    return this.http.get<Object[]>(this.url + '/data').pipe(
      tap(metrics => this.log('fetched metrics data')),
      catchError(this.handleError('getMetricsData', []))
    );
  }

  getMetrics(params?: HttpParams): Observable<Metric[]> {
    return this.http.get<Metric[]>(this.url, {params: params}).pipe(
      tap(metrics => this.log('fetched metrics')),
      catchError(this.handleError('getMetrics', []))
    );
  }

  getMetric(id: number): Observable<Metric> {
    return this.http.get<Metric>(this.url + '/' + id).pipe(
      tap(_ => this.log(`fetched visit id=${id}`)),
      catchError(this.handleError<Metric>(`getMetric id=${id}`))
    );
  }

  updateMetric(metric: Metric): Observable<any> {
    return this.http.put(this.url + '/' + metric.id, metric, httpOptions).pipe(
      tap(_ => this.log(`updated metric id=${metric.id}`)),
      catchError(this.handleError<any>('updateMetric'))
    );
  }

  addMetric(metric: Metric): Observable<Metric> {
    return this.http.post<Metric>(this.url, metric, httpOptions).pipe(
      tap((newVisit: Metric) => this.log(`added metric w/ id=${newVisit.id}`)),
      catchError(this.handleError<Metric>('addMetric'))
    );
  }

  deleteMetric(metric: Metric | number): Observable<Metric> {
    const id = typeof metric === 'number' ? metric : metric.id;
    return this.http.delete<Metric>(this.url + '/' + id, httpOptions).pipe(
      tap(_ => this.log(`deleted metric id=${id}`)),
      catchError(this.handleError<Metric>('deleteMetric'))
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
