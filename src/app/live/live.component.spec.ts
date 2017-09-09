import { async, discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { NgbAlert, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';

import { RacesModule } from '../races/races.module';
import { LiveComponent } from './live.component';
import { RaceService } from '../race.service';
import { PonyWithPositionModel } from '../models/pony.model';
import { RaceModel } from '../models/race.model';
import { PonyComponent } from '../pony/pony.component';

describe('LiveComponent', () => {

  const fakeRaceService = jasmine.createSpyObj('RaceService', ['live', 'boost']);

  beforeEach(() => TestBed.configureTestingModule({
    imports: [RacesModule, RouterTestingModule, NgbModule.forRoot()],
    providers: [
      { provide: RaceService, useValue: fakeRaceService }
    ]
  }));

  beforeEach(() => {
    fakeRaceService.live.calls.reset();
    fakeRaceService.boost.calls.reset();
  });

  it('should initialize the array of positions with an empty array', () => {
    const fakeActivatedRoute = TestBed.get(ActivatedRoute);
    const race = {
      id: 1,
      name: 'Lyon',
      status: 'PENDING',
      ponies: [],
      startInstant: '2016-02-18T08:02:00Z'
    } as RaceModel;
    fakeActivatedRoute.snapshot = { data: { race } };
    fakeRaceService.live.and.returnValue(Observable.of([]));

    const liveComponent = new LiveComponent(fakeRaceService, fakeActivatedRoute);
    expect(liveComponent.poniesWithPosition).toEqual([], 'poniesWithPosition should be initialized with an empty array');
  });

  it('should subscribe to the live observable if the race is PENDING', async(() => {
    const fakeActivatedRoute = TestBed.get(ActivatedRoute);
    const race = {
      id: 1,
      name: 'Lyon',
      status: 'PENDING',
      ponies: [],
      startInstant: '2016-02-18T08:02:00Z'
    } as RaceModel;
    fakeActivatedRoute.snapshot = { data: { race } };
    fakeRaceService.live.and.returnValue(Observable.empty());

    const liveComponent = new LiveComponent(fakeRaceService, fakeActivatedRoute);
    liveComponent.ngOnInit();

    expect(liveComponent.raceModel).toBe(race);
    expect(fakeRaceService.live).toHaveBeenCalledWith(1);
    expect(liveComponent.positionSubscription).not.toBeNull('positionSubscription should store the subscription');
  }));

  it('should subscribe to the live observable if the race is RUNNING', async(() => {
    const fakeActivatedRoute = TestBed.get(ActivatedRoute);
    const race = {
      id: 1,
      name: 'Lyon',
      status: 'RUNNING',
      ponies: [],
      startInstant: '2016-02-18T08:02:00Z'
    } as RaceModel;
    fakeActivatedRoute.snapshot = { data: { race } };
    fakeRaceService.live.and.returnValue(Observable.of([
      { id: 1, name: 'Sunny Sunday', color: 'BLUE', position: 0 }
    ]));

    const liveComponent = new LiveComponent(fakeRaceService, fakeActivatedRoute);
    liveComponent.ngOnInit();

    expect(liveComponent.raceModel).toBe(race);
    expect(fakeRaceService.live).toHaveBeenCalledWith(1);
    expect(liveComponent.positionSubscription).not.toBeNull('positionSubscription should store the subscription');
    expect(liveComponent.poniesWithPosition.length).toBe(1, 'poniesWithPositions should store the positions');
  }));

  it('should not subscribe to the live observable if the race is FINISHED', async(() => {
    const fakeActivatedRoute = TestBed.get(ActivatedRoute);
    const race = {
      id: 1,
      name: 'Lyon',
      status: 'FINISHED',
      ponies: [],
      startInstant: '2016-02-18T08:02:00Z'
    } as RaceModel;
    fakeActivatedRoute.snapshot = { data: { race } };
    fakeRaceService.live.and.returnValue(Observable.empty());

    const liveComponent = new LiveComponent(fakeRaceService, fakeActivatedRoute);
    liveComponent.ngOnInit();

    expect(liveComponent.raceModel).toBe(race);
    expect(fakeRaceService.live).not.toHaveBeenCalledWith(1);
    expect(liveComponent.positionSubscription).not.toBeNull('positionSubscription should store the subscription');
  }));

  it('should change the race status once the race is RUNNING', async(() => {
    const fakeActivatedRoute = TestBed.get(ActivatedRoute);
    const race = {
      id: 1,
      name: 'Lyon',
      status: 'PENDING',
      ponies: [],
      startInstant: '2016-02-18T08:02:00Z'
    } as RaceModel;
    fakeActivatedRoute.snapshot = { data: { race } };
    const positions = new Subject<Array<PonyWithPositionModel>>();
    fakeRaceService.live.and.returnValue(positions);

    const liveComponent = new LiveComponent(fakeRaceService, fakeActivatedRoute);
    liveComponent.ngOnInit();

    positions.next([
      { id: 1, name: 'Sunny Sunday', color: 'BLUE', position: 0 }
    ]);
    expect(liveComponent.poniesWithPosition.length).toBe(1, 'poniesWithPositions should store the positions');
    expect(liveComponent.raceModel.status).toBe('RUNNING', 'The race status should change to RUNNING once we receive positions');
  }));

  it('should switch the error flag if an error occurs', async(() => {
    const fakeActivatedRoute = TestBed.get(ActivatedRoute);
    const race = {
      id: 1,
      name: 'Lyon',
      status: 'RUNNING',
      ponies: [],
      startInstant: '2016-02-18T08:02:00Z'
    } as RaceModel;
    fakeActivatedRoute.snapshot = { data: { race } };
    const positions = new Subject<Array<PonyWithPositionModel>>();
    fakeRaceService.live.and.returnValue(positions);

    const liveComponent = new LiveComponent(fakeRaceService, fakeActivatedRoute);
    liveComponent.ngOnInit();

    positions.error(new Error('Oops'));
    expect(liveComponent.error).toBeTruthy('You should store that an error occurred in the `error` field');
  }));

  it('should unsubscribe on destruction', async(() => {
    const fakeActivatedRoute = TestBed.get(ActivatedRoute);
    const race = {
      id: 1,
      name: 'Lyon',
      status: 'RUNNING',
      ponies: [],
      startInstant: '2016-02-18T08:02:00Z'
    } as RaceModel;
    fakeActivatedRoute.snapshot = { data: { race } };
    const positions = new Subject<Array<PonyWithPositionModel>>();
    fakeRaceService.live.and.returnValue(positions);

    const liveComponent = new LiveComponent(fakeRaceService, fakeActivatedRoute);
    liveComponent.ngOnInit();

    spyOn(liveComponent.positionSubscription, 'unsubscribe');

    liveComponent.ngOnDestroy();

    expect(liveComponent.positionSubscription.unsubscribe).toHaveBeenCalled();
  }));

  it('should tidy things up when the race is over', async(() => {
    const fakeActivatedRoute = TestBed.get(ActivatedRoute);
    const race = {
      id: 1,
      name: 'Lyon',
      status: 'RUNNING',
      ponies: [],
      startInstant: '2016-02-18T08:02:00Z',
      betPonyId: 1
    } as RaceModel;
    fakeActivatedRoute.snapshot = { data: { race } };
    const positions = new Subject<Array<PonyWithPositionModel>>();
    fakeRaceService.live.and.returnValue(positions);

    const liveComponent = new LiveComponent(fakeRaceService, fakeActivatedRoute);
    liveComponent.ngOnInit();

    positions.next([
      { id: 1, name: 'Sunny Sunday', color: 'BLUE', position: 100 },
      { id: 2, name: 'Pinkie Pie', color: 'GREEN', position: 101 },
      { id: 3, name: 'Awesome Fridge', color: 'YELLOW', position: 97 }
    ]);
    expect(liveComponent.poniesWithPosition.length).toBe(3, 'poniesWithPositions should store the positions');
    expect(liveComponent.winners).toEqual([], 'The winners should be empty until the race is over');
    expect(liveComponent.betWon).toBeUndefined('The bet status should be undefined until the race is over');

    positions.complete();
    expect(liveComponent.raceModel.status).toBe('FINISHED', 'The race status should change to FINISHED once the race is over');
    expect(liveComponent.winners).not.toBeUndefined('The winners should be not undefined once the race is over');
    expect(liveComponent.winners.length).toBe(2, 'The winners should contain all the ponies that won the race');
    expect(liveComponent.winners.map(pony => pony.id)).toEqual([1, 2], 'The winners should contain all the ponies that won the race');
    expect(liveComponent.betWon).not.toBeUndefined('The bet status should not be undefined until the race is over');
    expect(liveComponent.betWon).toBeTruthy('The bet status should true if the player won the bet');
  }));

  it('should display the pending race', () => {
    const fakeActivatedRoute = TestBed.get(ActivatedRoute);
    const race = {
      id: 1,
      name: 'Lyon',
      status: 'PENDING',
      ponies: [
        { id: 1, name: 'Sunny Sunday', color: 'BLUE' },
        { id: 2, name: 'Pinkie Pie', color: 'GREEN' },
        { id: 3, name: 'Awesome Fridge', color: 'YELLOW' }
      ],
      startInstant: '2016-02-18T08:02:00Z'
    } as RaceModel;
    fakeActivatedRoute.snapshot = { data: { race } };
    const positions = new Subject<Array<PonyWithPositionModel>>();
    fakeRaceService.live.and.returnValue(positions);

    const fixture = TestBed.createComponent(LiveComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement;
    const title = element.querySelector('h2');
    expect(title).not.toBeNull('The template should display an h2 element with the race name inside');
    expect(title.textContent).toContain('Lyon', 'The template should display an h2 element with the race name inside');
    const liveRace = element.querySelector('#live-race');
    expect(liveRace.textContent).toContain('The race will start');

    const debugElement = fixture.debugElement;
    const ponyComponents = debugElement.queryAll(By.directive(PonyComponent));
    expect(ponyComponents).not.toBeNull('You should display a `PonyComponent` for each pony');
    expect(ponyComponents.length).toBe(3, 'You should display a `PonyComponent` for each pony');

    const sunnySunday = ponyComponents[0];
    expect(sunnySunday.componentInstance.isRunning).toBeFalsy('The ponies should not be running');
  });

  it('should display the running race', () => {
    const fakeActivatedRoute = TestBed.get(ActivatedRoute);
    const race = {
      id: 1,
      name: 'Lyon',
      status: 'PENDING',
      ponies: [
        { id: 1, name: 'Sunny Sunday', color: 'BLUE' },
        { id: 2, name: 'Pinkie Pie', color: 'GREEN' },
        { id: 3, name: 'Awesome Fridge', color: 'YELLOW' }
      ],
      startInstant: '2016-02-18T08:02:00Z'
    } as RaceModel;
    fakeActivatedRoute.snapshot = { data: { race } };
    const positions = new Subject<Array<PonyWithPositionModel>>();
    fakeRaceService.live.and.returnValue(positions);

    const fixture = TestBed.createComponent(LiveComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement;
    const title = element.querySelector('h2');
    expect(title).not.toBeNull('The template should display an h2 element with the race name inside');
    expect(title.textContent).toContain('Lyon', 'The template should display an h2 element with the race name inside');

    positions.next([
      { id: 1, name: 'Sunny Sunday', color: 'BLUE', position: 10 },
      { id: 2, name: 'Pinkie Pie', color: 'GREEN', position: 10 },
      { id: 3, name: 'Awesome Fridge', color: 'YELLOW', position: 9 }
    ]);
    fixture.detectChanges();

    const debugElement = fixture.debugElement;
    const ponyComponents = debugElement.queryAll(By.directive(PonyComponent));
    expect(ponyComponents).not.toBeNull('You should display a `PonyComponent` for each pony');
    expect(ponyComponents.length).toBe(3, 'You should display a `PonyComponent` for each pony');

    const sunnySunday = ponyComponents[0];
    expect(sunnySunday.componentInstance.isRunning).toBeTruthy('The ponies should be running');
  });

  it('should display the finished race', () => {
    const fakeActivatedRoute = TestBed.get(ActivatedRoute);
    const race = {
      id: 1,
      name: 'Lyon',
      status: 'PENDING',
      ponies: [
        { id: 1, name: 'Sunny Sunday', color: 'BLUE' },
        { id: 2, name: 'Pinkie Pie', color: 'GREEN' },
        { id: 3, name: 'Awesome Fridge', color: 'YELLOW' }
      ],
      startInstant: '2016-02-18T08:02:00Z',
      betPonyId: 1
    } as RaceModel;
    fakeActivatedRoute.snapshot = { data: { race } };
    const positions = new Subject<Array<PonyWithPositionModel>>();
    fakeRaceService.live.and.returnValue(positions);

    const fixture = TestBed.createComponent(LiveComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement;
    const title = element.querySelector('h2');
    expect(title).not.toBeNull('The template should display an h2 element with the race name inside');
    expect(title.textContent).toContain('Lyon', 'The template should display an h2 element with the race name inside');

    positions.next([
      { id: 1, name: 'Sunny Sunday', color: 'BLUE', position: 101 },
      { id: 2, name: 'Pinkie Pie', color: 'GREEN', position: 100 },
      { id: 3, name: 'Awesome Fridge', color: 'YELLOW', position: 9 }
    ]);
    positions.complete();
    fixture.detectChanges();

    // won the bet!
    const debugElement = fixture.debugElement;
    const ponyComponents = debugElement.queryAll(By.directive(PonyComponent));
    expect(ponyComponents).not.toBeNull('You should display a `PonyComponent` for each winner');
    expect(ponyComponents.length).toBe(2, 'You should display a `PonyComponent` for each pony');

    const sunnySunday = ponyComponents[0];
    expect(sunnySunday.componentInstance.isRunning).toBeFalsy('The ponies should be not running');

    const success = fixture.debugElement.query(By.directive(NgbAlert));
    expect(success).not.toBeNull('You should have a success NgbAlert to display the bet won');
    expect(success.nativeElement.textContent).toContain('You won your bet!');
    expect(success.componentInstance.type).toBe('success', 'The alert should be a success one');

    // lost the bet...
    fixture.componentInstance.betWon = false;
    fixture.detectChanges();
    const betFailed = fixture.debugElement.query(By.directive(NgbAlert));
    expect(betFailed).not.toBeNull('You should have a warning NgbAlert to display the bet failed');
    expect(betFailed.nativeElement.textContent).toContain('You lost your bet.');
    expect(betFailed.componentInstance.type).toBe('warning', 'The alert should be a warning one');

    // no winners (race was already over)
    fixture.componentInstance.winners = [];
    fixture.detectChanges();
    expect(element.textContent).toContain('The race is over.');

    // an error occurred
    fixture.componentInstance.error = true;
    fixture.detectChanges();
    const alert = debugElement.query(By.directive(NgbAlert));
    expect(alert).not.toBeNull('You should have an NgbAlert to display the error');
    expect(alert.nativeElement.textContent).toContain('A problem occurred during the live.');
    expect(alert.componentInstance.type).toBe('danger', 'The alert should be a danger one');

    // close the alert
    alert.componentInstance.closeHandler();
    fixture.detectChanges();
    expect(debugElement.query(By.directive(NgbAlert))).not.toBeNull('The NgbAlert should not be closable');
  });

  it('should listen to click events on ponies in the template', () => {
    const fakeActivatedRoute = TestBed.get(ActivatedRoute);
    const race = {
      id: 1,
      name: 'Lyon',
      status: 'RUNNING',
      ponies: [
        { id: 1, name: 'Sunny Sunday', color: 'BLUE' },
        { id: 2, name: 'Pinkie Pie', color: 'GREEN' },
        { id: 3, name: 'Awesome Fridge', color: 'YELLOW' }
      ],
      startInstant: '2016-02-18T08:02:00Z',
      betPonyId: 1
    } as RaceModel;
    fakeActivatedRoute.snapshot = { data: { race } };
    const positions = new Subject<Array<PonyWithPositionModel>>();
    fakeRaceService.live.and.returnValue(positions);

    const fixture = TestBed.createComponent(LiveComponent);
    fixture.detectChanges();

    spyOn(fixture.componentInstance, 'onClick');

    // let's start the race
    const poniesWithPositions = [
      { id: 1, name: 'Sunny Sunday', color: 'BLUE', position: 10 },
      { id: 2, name: 'Pinkie Pie', color: 'GREEN', position: 12 },
      { id: 3, name: 'Awesome Fridge', color: 'YELLOW', position: 6 }
    ];
    positions.next(poniesWithPositions);
    fixture.detectChanges();

    // when clicking on the first pony
    const ponyComponent = fixture.debugElement.query(By.directive(PonyComponent));
    expect(ponyComponent).not.toBeNull('You should display a `PonyComponent` for each pony');
    ponyComponent.triggerEventHandler('ponyClicked', {});

    // then the click handler should have been called with the first pony
    expect(fixture.componentInstance.onClick).toHaveBeenCalledWith(poniesWithPositions[0]);
  });

  it('should emit an event with the pony when a pony is clicked', () => {
    const fakeActivatedRoute = TestBed.get(ActivatedRoute);
    const race = {
      id: 1,
      name: 'Lyon',
      status: 'RUNNING',
      ponies: [],
      startInstant: '2016-02-18T08:02:00Z',
      betPonyId: 1
    } as RaceModel;
    fakeActivatedRoute.snapshot = { data: { race } };

    const liveComponent = new LiveComponent(fakeRaceService, fakeActivatedRoute);
    liveComponent.ngOnInit();

    spyOn(liveComponent.clickSubject, 'next');

    const pony = { id: 1, name: 'Sunny Sunday', color: 'BLUE', position: 10 };

    // when a click is received
    liveComponent.onClick(pony);

    // then we should emit the pony on the subject
    expect(liveComponent.clickSubject.next).toHaveBeenCalledWith(pony);
  });

  it('should buffer clicks over a second and call the boost method', fakeAsync(() => {
    const fakeActivatedRoute = TestBed.get(ActivatedRoute);
    const race = {
      id: 1,
      name: 'Lyon',
      status: 'RUNNING',
      ponies: [],
      startInstant: '2016-02-18T08:02:00Z',
      betPonyId: 1
    } as RaceModel;
    fakeActivatedRoute.snapshot = { data: { race } };
    fakeRaceService.boost.and.returnValue(Observable.of(race));

    const liveComponent = new LiveComponent(fakeRaceService, fakeActivatedRoute);
    liveComponent.ngOnInit();
    tick();

    const pony = { id: 1, name: 'Sunny Sunday', color: 'BLUE', position: 10 };

    // when 5 clicks are emitted in a second
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    tick(1000);

    // then we should call the boost method
    expect(fakeRaceService.boost).toHaveBeenCalledWith(race.id, pony.id);
    fakeRaceService.boost.calls.reset();

    // when 5 clicks are emitted over 2 seconds
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    tick(1000);
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    tick(1000);

    // then we should not call the boost method
    expect(fakeRaceService.boost).not.toHaveBeenCalled();
  }));

  it('should filter click buffer that are not at least 5', fakeAsync(() => {
    const fakeActivatedRoute = TestBed.get(ActivatedRoute);
    const race = {
      id: 1,
      name: 'Lyon',
      status: 'RUNNING',
      ponies: [],
      startInstant: '2016-02-18T08:02:00Z',
      betPonyId: 1
    } as RaceModel;
    fakeActivatedRoute.snapshot = { data: { race } };
    fakeRaceService.boost.and.returnValue(Observable.of(race));

    const liveComponent = new LiveComponent(fakeRaceService, fakeActivatedRoute);
    liveComponent.ngOnInit();
    tick();

    const pony = { id: 1, name: 'Sunny Sunday', color: 'BLUE', position: 10 };
    const pony2 = { id: 2, name: 'Black Friday', color: 'GREEN', position: 11 };

    // when 4 clicks are emitted in a second
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    tick(1000);

    // then we should not call the boost method
    expect(fakeRaceService.boost).not.toHaveBeenCalled();

    // when 5 clicks are emitted over a second on two ponies
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony2);
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony2);
    liveComponent.clickSubject.next(pony);
    tick(1000);

    // then we should not call the boost method
    expect(fakeRaceService.boost).not.toHaveBeenCalled();
  }));

  it('should throttle repeated boosts', fakeAsync(() => {
    const fakeActivatedRoute = TestBed.get(ActivatedRoute);
    const race = {
      id: 1,
      name: 'Lyon',
      status: 'RUNNING',
      ponies: [],
      startInstant: '2016-02-18T08:02:00Z',
      betPonyId: 1
    } as RaceModel;
    fakeActivatedRoute.snapshot = { data: { race } };
    fakeRaceService.boost.and.returnValue(Observable.of(race));

    const liveComponent = new LiveComponent(fakeRaceService, fakeActivatedRoute);
    liveComponent.ngOnInit();
    tick();

    const pony = { id: 1, name: 'Sunny Sunday', color: 'BLUE', position: 10 };

    // when 5 clicks are emitted in a second
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    tick(800);
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    tick(200);

    // then we should call the boost method
    expect(fakeRaceService.boost).toHaveBeenCalled();
    fakeRaceService.boost.calls.reset();

    // when 2 other clicks are emitted
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    tick(800);

    // then we should not call the boost method with the throttling
    expect(fakeRaceService.boost).not.toHaveBeenCalled();

    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    tick(200);

    // we should call it a bit later
    expect(fakeRaceService.boost).toHaveBeenCalled();
    discardPeriodicTasks();
  }));

  it('should catch a boost error', fakeAsync(() => {
    const fakeActivatedRoute = TestBed.get(ActivatedRoute);
    const race = {
      id: 1,
      name: 'Lyon',
      status: 'RUNNING',
      ponies: [],
      startInstant: '2016-02-18T08:02:00Z',
      betPonyId: 1
    } as RaceModel;
    fakeActivatedRoute.snapshot = { data: { race } };
    const boost = new Subject<RaceModel>();
    fakeRaceService.boost.and.returnValue(boost);

    const liveComponent = new LiveComponent(fakeRaceService, fakeActivatedRoute);
    liveComponent.ngOnInit();
    tick();

    const pony = { id: 1, name: 'Sunny Sunday', color: 'BLUE', position: 10 };

    // when 5 clicks are emitted in a second
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    tick(1000);

    // then we should call the boost method
    expect(fakeRaceService.boost).toHaveBeenCalled();
    fakeRaceService.boost.calls.reset();
    boost.error('You should catch a potential error from the boost method with a `catch` operator');

    // when 5 other clicks are emitted
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    tick(1000);

    // we should call it again if the previous error has been handled
    expect(fakeRaceService.boost).toHaveBeenCalled();
    discardPeriodicTasks();
  }));

  it('should use a trackBy method', () => {
    const fakeActivatedRoute = TestBed.get(ActivatedRoute);
    const race = {
      id: 1,
      name: 'Lyon',
      status: 'RUNNING',
      ponies: [],
      startInstant: '2016-02-18T08:02:00Z',
      betPonyId: 1
    } as RaceModel;
    fakeActivatedRoute.snapshot = { data: { race } };
    const positions = new Subject<Array<PonyWithPositionModel>>();
    fakeRaceService.live.and.returnValue(positions);
    fakeRaceService.boost.and.returnValue(Observable.of(race));

    const fixture = TestBed.createComponent(LiveComponent);
    fixture.detectChanges();

    const poniesWithPositions = [
      { id: 1, name: 'Sunny Sunday', color: 'BLUE', position: 10 },
      { id: 2, name: 'Pinkie Pie', color: 'GREEN', position: 12 },
      { id: 3, name: 'Awesome Fridge', color: 'YELLOW', position: 6 }
    ];

    const trackByResult = fixture.componentInstance.ponyById(1, poniesWithPositions[0]);
    expect(trackByResult).toBe(1, 'The ponyById method should return the id of the pony');

    // we send some ponies
    positions.next(poniesWithPositions);
    fixture.detectChanges();

    const ponyComponent = fixture.nativeElement.querySelector('div.pony-wrapper');
    expect(ponyComponent).not.toBeNull('You should display a `PonyComponent` for each pony');

    // then the same ponies with other positions
    const otherPoniesWithPositions = [
      { id: 1, name: 'Sunny Sunday', color: 'BLUE', position: 14 },
      { id: 2, name: 'Pinkie Pie', color: 'GREEN', position: 18 },
      { id: 3, name: 'Awesome Fridge', color: 'YELLOW', position: 9 }
    ];

    positions.next(otherPoniesWithPositions);
    fixture.detectChanges();
    const otherPonyComponent = fixture.nativeElement.querySelector('div.pony-wrapper');
    expect(ponyComponent).toBe(otherPonyComponent, 'You should use trackBy in your template');
  });
});
