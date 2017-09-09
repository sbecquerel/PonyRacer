import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'pr-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  userForm: FormGroup;
  loginCtrl: FormControl;
  passwordForm: FormGroup;
  passwordCtrl: FormControl;
  confirmPasswordCtrl: FormControl;
  birthYearCtrl: FormControl;
  registrationFailed = false;

  static passwordMatch(group: FormGroup) {
    return group.controls.password.value !== group.controls.confirmPassword.value ? {matchingError: true} : null;
  }

  static validYear(control: FormControl) {
    return control.value > 1900 && control.value <= (new Date()).getFullYear() ? null : {invalidYear: true};
  }

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loginCtrl = this.formBuilder.control('', [Validators.required, Validators.minLength(3)]);
    this.passwordCtrl = this.formBuilder.control('', [Validators.required]);
    this.confirmPasswordCtrl = this.formBuilder.control('', [Validators.required]);
    this.birthYearCtrl = this.formBuilder.control('', [Validators.required, RegisterComponent.validYear]);

    this.passwordForm = this.formBuilder.group({
      password: this.passwordCtrl,
      confirmPassword: this.confirmPasswordCtrl
    }, {validator: RegisterComponent.passwordMatch});

    this.userForm = this.formBuilder.group({
      login: this.loginCtrl,
      passwordForm: this.passwordForm,
      birthYear: this.birthYearCtrl
    });
  }

  register() {
    this.userService.register(
      this.loginCtrl.value,
      this.passwordCtrl.value,
      this.birthYearCtrl.value
    ).subscribe(
      () => this.router.navigate(['/']),
      () => this.registrationFailed = true
    );
  }
}
