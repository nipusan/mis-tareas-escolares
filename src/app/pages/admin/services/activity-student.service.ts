import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ActivityStudent } from '@app/shared/models/activity-student.interface';

@Injectable({
  providedIn: 'root',
})
export class ActivityStudentService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<ActivityStudent[]> {
    return this.http
      .get<ActivityStudent[]>(`${environment.API_URL}/activity-student`)
      .pipe(catchError(this.handlerError));
  }

  getById(userId: number): Observable<ActivityStudent> {
    return this.http
      .get<any>(`${environment.API_URL}/activity-student/${userId}`)
      .pipe(catchError(this.handlerError));
  }

  getActivitiesByStudentDocument(document: number): Observable<ActivityStudent[]> {
    return this.http
      .get<any>(`${environment.API_URL}/activity-student/activities-by-student-document/${document}`)
      .pipe(catchError(this.handlerError));
  }

  new(user: ActivityStudent): Observable<ActivityStudent> {
    return this.http
      .post<ActivityStudent>(`${environment.API_URL}/activity-student`, user)
      .pipe(catchError(this.handlerError));
  }

  update(userId: number, user: ActivityStudent): Observable<ActivityStudent> {
    return this.http
      .patch<ActivityStudent>(`${environment.API_URL}/activity-student/${userId}`, user)
      .pipe(catchError(this.handlerError));
  }

  delete(userId: number): Observable<{}> {
    return this.http
      .delete<ActivityStudent>(`${environment.API_URL}/activity-student/${userId}`)
      .pipe(catchError(this.handlerError));
  }

  handlerError(error): Observable<never> {
    let errorMessage = 'Error unknown';
    if (error) {
      errorMessage = `Error ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
