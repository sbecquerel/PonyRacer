import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class JwtInterceptorService implements HttpInterceptor {

  private token;

  constructor() {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.token) {
      return next.handle(req.clone({
        setHeaders: {
          'Authorization': `Bearer ${this.token}`
        }
      }));
    }
    return next.handle(req);
  }

  setJwtToken(token) {
    this.token = token;
  }

  removeJwtToken() {
    this.token = null;
  }
}
