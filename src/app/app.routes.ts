import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoggedInGuard } from './logged-in.guard';

export const ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { path: 'races', canActivate: [LoggedInGuard], loadChildren: './races/races.module#RacesModule'},
  { path: 'users', loadChildren: './users/users.module#UsersModule'}
];
