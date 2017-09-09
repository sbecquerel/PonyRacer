import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { UserModel } from './models/user.model';
import 'rxjs/add/operator/do';
import { environment } from '../environments/environment';
import { JwtInterceptorService } from './jwt-interceptor.service';
import { WsService } from './ws.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService {

  userEvents: BehaviorSubject<UserModel>;

  constructor(private http: HttpClient, private jwtInterceptor: JwtInterceptorService, private wsService: WsService) {
    this.userEvents = new BehaviorSubject(undefined);
    this.retrieveUser();
  }

  register(login: string, password: string, birthYear: number) {
    return this.http.post(`${environment.baseUrl}/api/users`, {
      login,
      password,
      birthYear
    });
  }

  authenticate(credentials: {login: string; password: string}) {
    return this.http.post(`${environment.baseUrl}/api/users/authentication`, credentials)
      .do((user: UserModel) => this.storeLoggedInUser(user));
  }

  storeLoggedInUser(user) {
    window.localStorage.setItem('rememberMe', JSON.stringify(user));
    this.userEvents.next(user);
    this.jwtInterceptor.setJwtToken(user.token);
  }

  retrieveUser() {
    const rememberMe = window.localStorage.getItem('rememberMe');

    if (rememberMe) {
      const user = JSON.parse(rememberMe);
      this.userEvents.next(user);
      this.jwtInterceptor.setJwtToken(user.token);
    }
  }

  logout() {
    this.userEvents.next(null);
    this.jwtInterceptor.removeJwtToken();
    window.localStorage.removeItem('rememberMe');
  }

  scoreUpdates(userId): Observable<UserModel> {
    return this.wsService.connect(`/player/${userId}`);
  }

  isLoggedIn() {
    return window.localStorage.getItem('rememberMe') != null;
  }
}
