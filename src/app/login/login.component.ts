import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'pr-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  credentials = {
    login: '',
    password: ''
  };
  authenticationFailed = false;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
  }

  authenticate() {
    this.userService.authenticate(this.credentials).subscribe(
      () => this.router.navigate(['/']),
      () => this.authenticationFailed = true
    );
  }
}
