import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/empty';

import { RacesResolverService } from './races-resolver.service';
import { RaceService } from './race.service';
import { RaceModel } from './models/race.model';
import { AppModule } from './app.module';
import { RacesModule } from './races/races.module';
import { RACES_ROUTES } from './races/races.routes';
import { AppComponent } from './app.component';

describe('RacesResolverService', () => {
  let appComponentFixture;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        RacesModule,
        RouterTestingModule
      ]
    });

    // override the lazy loaded module
    const router = TestBed.get(Router);
    router.resetConfig([
      { path: 'races', children: RACES_ROUTES },
    ]);

    appComponentFixture = TestBed.createComponent(AppComponent);
    appComponentFixture.detectChanges();
  });

  it('should resolve races using the path of the activated route config ', () => {
    const raceService = TestBed.get(RaceService);
    const expectedResult: Observable<Array<RaceModel>> = Observable.empty();

    spyOn(raceService, 'list').and.returnValue(expectedResult);

    const resolver = TestBed.get(RacesResolverService);
    const routeSnapshot = {
      routeConfig: { path: 'finished' }
    } as ActivatedRouteSnapshot;
    const result = resolver.resolve(routeSnapshot);

    expect(result).toBe(expectedResult, 'The resolver should return the races');
    expect(raceService.list).toHaveBeenCalledWith('FINISHED');
  });

  it('should be applied on the pending races route', fakeAsync(() => {
    const resolver = TestBed.get(RacesResolverService);
    spyOn(resolver, 'resolve').and.returnValue(Observable.of([]));

    const router = TestBed.get(Router);
    router.navigateByUrl('/races/pending');

    tick();
    appComponentFixture.detectChanges();
    expect(resolver.resolve).toHaveBeenCalled();
  }));

  it('should be applied on the finished races route', fakeAsync(() => {
    const resolver = TestBed.get(RacesResolverService);
    spyOn(resolver, 'resolve').and.returnValue(Observable.of([]));

    const router = TestBed.get(Router);
    router.navigateByUrl('/races/finished');

    tick();
    appComponentFixture.detectChanges();
    expect(resolver.resolve).toHaveBeenCalled();
  }));
});
