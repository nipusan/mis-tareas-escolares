import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Course } from '@app/shared/models/course.interface';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Course[]> {
    return this.http
      .get<Course[]>(`${environment.API_URL}/courses`)
      .pipe(catchError(this.handlerError));
  }

  getMyCourses(): Observable<Course[]> {
    return this.http
      .get<Course[]>(`${environment.API_URL}/courses/my-courses`)
      .pipe(catchError(this.handlerError));
  }

  getById(userId: number): Observable<Course> {
    return this.http
      .get<any>(`${environment.API_URL}/courses/${userId}`)
      .pipe(catchError(this.handlerError));
  }

  new(user: Course): Observable<Course> {
    return this.http
      .post<Course>(`${environment.API_URL}/courses`, user)
      .pipe(catchError(this.handlerError));
  }

  update(userId: number, user: Course): Observable<Course> {
    return this.http
      .patch<Course>(`${environment.API_URL}/courses/${userId}`, user)
      .pipe(catchError(this.handlerError));
  }

  delete(userId: number): Observable<{}> {
    return this.http
      .delete<Course>(`${environment.API_URL}/courses/${userId}`)
      .pipe(catchError(this.handlerError));
  }

  handlerError(error): Observable<never> {
    let errorMessage = 'Error unknown';
    if (error) {
      errorMessage = `Error ${error.message}`;
    }
    //window.alert(errorMessage);
    console.info(errorMessage);
    return throwError(errorMessage);
  }
}
