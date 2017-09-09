import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Subject } from 'rxjs/Subject';

import { environment } from '../environments/environment';
import { RaceService } from './race.service';
import { WsService } from './ws.service';
import { RaceModel } from './models/race.model';
import { PonyWithPositionModel } from './models/pony.model';

describe('RaceService', () => {

  let raceService: RaceService;
  let http: HttpTestingController;
  const wsService = jasmine.createSpyObj('WsService', ['connect']);

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [
      { provide: WsService, useValue: wsService },
      RaceService
    ]
  }));

  beforeEach(() => {
    raceService = TestBed.get(RaceService);
    http = TestBed.get(HttpTestingController);
  });

  it('should return an Observable of 3 races', () => {
    // fake response
    const hardcodedRaces = [{ name: 'Paris' }, { name: 'Tokyo' }, { name: 'Lyon' }];

    let actualRaces = [];
    raceService.list('PENDING').subscribe((races: Array<RaceModel>) => actualRaces = races);

    http.expectOne(`${environment.baseUrl}/api/races?status=PENDING`)
      .flush(hardcodedRaces);

    expect(actualRaces).toEqual(hardcodedRaces, 'The `list` method should return an array of RaceModel wrapped in an Observable');
  });

  it('should get a race', () => {
    // fake response
    const race = { name: 'Paris' } as RaceModel;
    const raceId = 1;

    let actualRace;
    raceService.get(raceId).subscribe(fetchedRace => actualRace = fetchedRace);

    http.expectOne(`${environment.baseUrl}/api/races/${raceId}`)
      .flush(race);

    expect(actualRace).toBe(race, 'The observable must emit the race');
  });

  it('should bet on a race', () => {
    // fake response
    const race = { name: 'Paris' } as RaceModel;
    const raceId = 1;
    const ponyId = 2;

    let actualRace;
    raceService.bet(raceId, ponyId).subscribe(fetchedRace => actualRace = fetchedRace);

    const req = http.expectOne({ method: 'POST', url: `${environment.baseUrl}/api/races/${raceId}/bets` });
    expect(req.request.body).toEqual({ ponyId });
    req.flush(race);

    expect(actualRace).toBe(race, 'The observable must emit the race');
  });

  it('should cancel a bet on a race', () => {
    const raceId = 1;

    raceService.cancelBet(raceId).subscribe(() => {});

    http.expectOne({ method: 'DELETE', url: `${environment.baseUrl}/api/races/${raceId}/bets` })
      .flush(null);
  });

  it('should return live positions from websockets', () => {
    const raceId = 1;
    const messages = new Subject<{ status: string; ponies: Array<PonyWithPositionModel> }>();
    let positions: Array<PonyWithPositionModel> = [];

    wsService.connect.and.returnValue(messages);

    raceService.live(raceId).subscribe(pos => {
      positions = pos;
    });

    expect(wsService.connect).toHaveBeenCalledWith(`/race/${raceId}`);

    messages.next({
      status: 'RUNNING',
      ponies: [{
        id: 1,
        name: 'Superb Runner',
        color: 'BLUE',
        position: 1
      }]
    });

    expect(positions.length).toBe(1);
    expect(positions[0].position).toBe(1);

    messages.next({
      status: 'RUNNING',
      ponies: [{
        id: 1,
        name: 'Superb Runner',
        color: 'BLUE',
        position: 100
      }]
    });

    expect(positions.length).toBe(1);
    expect(positions[0].position).toBe(100);

    messages.next({
      status: 'FINISHED',
      ponies: [{
        id: 1,
        name: 'Superb Runner',
        color: 'BLUE',
        position: 101
      }]
    });

    expect(positions.length).toBe(1);
    expect(positions[0].position).toBe(100, 'The observable should stop emitting if the race status is FINISHED');
  });

  it('should boost a pony in a race', () => {
    // fake response
    const race = { name: 'Paris' } as RaceModel;
    const ponyId = 12;
    const raceId = 1;

    let actualRace;
    raceService.boost(raceId, ponyId).subscribe(fetchedRace => actualRace = fetchedRace);

    const req = http.expectOne({ method: 'POST', url: `${environment.baseUrl}/api/races/${raceId}/boosts` });
    expect(req.request.body).toEqual({ ponyId });
    req.flush(race);

    expect(actualRace).toBe(race, 'The observable must emit the race');
  });

});
