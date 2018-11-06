import { Injectable } from '@angular/core';
import { Category } from './category';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private url = environment.api_url + 'categories';

  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) { }

  private log(message: string) {
    this.messageService.add(`CategoryService: ${message}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.url).pipe(
      tap(categories => this.log('fetched categories')),
      catchError(this.handleError('getCategories', []))
    );
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(this.url + '/' + id).pipe(
      tap(_ => this.log(`fetched category id=${id}`)),
      catchError(this.handleError<Category>(`getCategory id=${id}`))
    );
  }

  updateCategory(category: Category): Observable<any> {
    return this.http.put(this.url + '/' + category.id, category, httpOptions).pipe(
      tap(_ => this.log(`updated category id=${category.id}`)),
      catchError(this.handleError<any>('updateCategory'))
    );
  }

  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.url, category, httpOptions).pipe(
      tap((newVisit: Category) => this.log(`added category w/ id=${newVisit.id}`)),
      catchError(this.handleError<Category>('addCategory'))
    );
  }

  deleteCategory(category: Category | number): Observable<Category> {
    const id = typeof category === 'number' ? category : category.id;
    return this.http.delete<Category>(this.url + '/' + id, httpOptions).pipe(
      tap(_ => this.log(`deleted category id=${id}`)),
      catchError(this.handleError<Category>('deleteCategory'))
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
