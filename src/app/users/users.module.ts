import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { USERS_ROUTES } from './users.routes';
import { SharedModule } from '../shared/shared.module';

// Components
import { RegisterComponent } from '../register/register.component';
import { LoginComponent } from '../login/login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(USERS_ROUTES),
    SharedModule
  ],
  declarations: [
    RegisterComponent,
    LoginComponent
  ]
})
export class UsersModule { }
