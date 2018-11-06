import { Injectable } from '@angular/core';
import { Exam } from './exam';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private url = environment.api_url + 'exams';

  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) { }

  private log(message: string) {
    this.messageService.add(`ExamService: ${message}`);
  }

  getExams(params: HttpParams): Observable<Exam[]> {
    return this.http.get<Exam[]>(this.url, {params: params}).pipe(
      tap(exams => this.log('fetched visits')),
      catchError(this.handleError('getExams', []))
    );
  }

  addExam(exam: Exam): Observable<Exam> {
    return this.http.post<Exam>(this.url, exam, httpOptions).pipe(
      tap((newExam: Exam) => this.log(`added exam w/ id=${newExam.id}`)),
      catchError(this.handleError<Exam>('addVisit'))
    );
  }

  deleteExam(exam: Exam | number): Observable<Exam> {
    const id = typeof exam === 'number' ? exam : exam.id;
    return this.http.delete<Exam>(this.url + '/' + id, httpOptions).pipe(
      tap(_ => this.log(`deleted exam id=${id}`)),
      catchError(this.handleError<Exam>('deleteExam'))
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
