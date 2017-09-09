import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserModel } from '../models/user.model';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/concat';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'pr-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {

  navbarCollapsed = true;
  user: UserModel;
  userEventsSubscription;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.userEventsSubscription = this.userService.userEvents
      .switchMap(user => user ?
          Observable.of(user).concat(this.userService.scoreUpdates(user.id).catch(() => Observable.empty())) :
          Observable.of(null)
      )
      .subscribe((user: UserModel) => this.user = user);
  }

  ngOnDestroy() {
    if (this.userEventsSubscription) {
      this.userEventsSubscription.unsubscribe();
    }
  }

  toggleNavbar() {
    this.navbarCollapsed = ! this.navbarCollapsed;
  }

  logout(e: Event) {
    e.preventDefault();
    this.userService.logout();
    this.router.navigate(['/']);
  }
}
