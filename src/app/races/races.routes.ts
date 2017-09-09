import { Routes } from '@angular/router';
import { RacesComponent } from '../races/races.component';
import { PendingRacesComponent } from '../races/pending-races/pending-races.component';
import { FinishedRacesComponent } from '../races/finished-races/finished-races.component';
import { BetComponent } from '../bet/bet.component';
import { LiveComponent } from '../live/live.component';
import { RacesResolverService } from '../races-resolver.service';
import { RaceResolverService } from '../race-resolver.service';

export const RACES_ROUTES: Routes = [
  { path: '', component: RacesComponent, children: [
    { path: '', pathMatch: 'full', redirectTo: 'pending' },
    { path: 'pending', component: PendingRacesComponent, resolve: {races: RacesResolverService} },
    { path: 'finished', component: FinishedRacesComponent, resolve: {races: RacesResolverService} }
  ]},
  { path: ':raceId', component: BetComponent, resolve: {race: RaceResolverService} },
  { path: ':raceId/live', component: LiveComponent, resolve: {race: RaceResolverService} }
];
