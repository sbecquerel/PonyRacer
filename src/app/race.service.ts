import { Injectable } from '@angular/core';
import { RaceModel } from './models/race.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeWhile';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';
import { PonyWithPositionModel } from './models/pony.model';
import { WsService } from './ws.service';

@Injectable()
export class RaceService {

  constructor(private http: HttpClient, private wsService: WsService) { }

  list(status: string): Observable<Array<RaceModel>> {
    return this.http.get<Array<RaceModel>>(`${environment.baseUrl}/api/races`, {params: new HttpParams().set('status', status)});
  }

  bet(raceId, ponyId): Observable<RaceModel> {
    return this.http.post<RaceModel>(`${environment.baseUrl}/api/races/${raceId}/bets`, {
      ponyId
    });
  }

  get(raceId): Observable<RaceModel> {
    return this.http.get<RaceModel>(`${environment.baseUrl}/api/races/${raceId}`);
  }

  cancelBet(raceId) {
    return this.http.delete(`${environment.baseUrl}/api/races/${raceId}/bets`);
  }

  live(raceId): Observable<Array<PonyWithPositionModel>> {
    return this.wsService.connect(`/race/${raceId}`)
      .takeWhile(liveRace => liveRace.status !== 'FINISHED')
      .map(liveRace => liveRace.ponies);
  }

  boost(raceId, ponyId) {
    return this.http.post(`${environment.baseUrl}/api/races/${raceId}/boosts`, {ponyId});
  }
}
