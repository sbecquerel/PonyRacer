import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Components
import { RacesComponent } from './races.component';
import { RaceComponent } from '../race/race.component';
import { PendingRacesComponent } from './pending-races/pending-races.component';
import { FinishedRacesComponent } from './finished-races/finished-races.component';
import { PonyComponent } from '../pony/pony.component';
import { BetComponent } from '../bet/bet.component';
import { LiveComponent } from '../live/live.component';
import { SharedModule } from '../shared/shared.module';

// Pipes
import { FromNowPipe } from '../from-now.pipe';

// Services
import { RaceService } from '../race.service';
import { RaceResolverService } from '../race-resolver.service';
import { RacesResolverService } from '../races-resolver.service';

import { RACES_ROUTES } from './races.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(RACES_ROUTES),
    SharedModule
  ],
  declarations: [
    RacesComponent,
    RaceComponent,
    PendingRacesComponent,
    FinishedRacesComponent,
    PonyComponent,
    BetComponent,
    LiveComponent,
    FromNowPipe
  ],
  providers: [
    RaceService,
    RaceResolverService,
    RacesResolverService
  ]
})
export class RacesModule { }
