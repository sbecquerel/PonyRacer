import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RaceModel } from './models/race.model';
import { Observable } from 'rxjs/Observable';
import { RaceService } from './race.service';

@Injectable()
export class RaceResolverService implements Resolve<RaceModel> {

  constructor(private raceService: RaceService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RaceModel> {
    return this.raceService.get(route.paramMap.get('raceId'));
  }
}
