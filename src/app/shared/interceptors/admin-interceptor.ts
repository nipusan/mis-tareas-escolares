import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '@auth/auth.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';
@Injectable()
export class AdminInterceptor implements HttpInterceptor {
  constructor(private authSvc: AuthService, private snackBar: MatSnackBar) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (req.url.includes('users') || req.url.includes('courses')) {

      try {
        const userValue = this.authSvc.userValue;
        console.log('validando desde interceptor')
        const authReq = req.clone({
          setHeaders: {
            auth: userValue.token,
          },
        });
        return next.handle(authReq);

      } catch (error) {
        this.snackBar.open('No autorizado:', 'Error validando autenticación', { duration: 5000, verticalPosition: 'top' });
      }

    }
    return next.handle(req);
  }
}
