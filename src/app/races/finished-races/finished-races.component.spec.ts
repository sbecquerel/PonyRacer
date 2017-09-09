import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { NgbModule, NgbPagination } from '@ng-bootstrap/ng-bootstrap';

import { FinishedRacesComponent } from './finished-races.component';
import { RacesModule } from '../races.module';
import { RaceComponent } from '../../race/race.component';

describe('FinishedRacesComponent', () => {
  const activatedRoute = {
    snapshot: {
      data: {
        races: [
          { name: 'Lyon' },
          { name: 'Los Angeles' },
          { name: 'Sydney' },
          { name: 'Tokyo' },
          { name: 'Casablanca' },
          { name: 'Paris' },
          { name: 'London' },
          { name: 'Madrid' },
          { name: 'Lima' },
          { name: 'Bali' },
          { name: 'Berlin' },
          { name: 'Moscow' }
        ]
      }
    }
  };

  beforeEach(() => TestBed.configureTestingModule({
    imports: [RacesModule, RouterTestingModule, NgbModule.forRoot()],
    providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
  }));

  it('should display every race name in a title', () => {
    const fixture = TestBed.createComponent(FinishedRacesComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.races).not.toBeNull('You need to have a field `races` initialized with all races');
    expect(fixture.componentInstance.races.length).toBe(12, 'You need to have a field `races` initialized with all races');
    expect(fixture.componentInstance.page).toBe(1, 'You need to have a field `page` initialized with 1');

    const debugElement = fixture.debugElement;
    const raceNames = debugElement.queryAll(By.directive(RaceComponent));
    expect(raceNames.length).toBe(10, 'You should have 10 `RaceComponent` displayed');
    expect(raceNames[0].componentInstance.raceModel.name).toBe('Lyon', 'You should display the first page races');

    const pagination = debugElement.query(By.directive(NgbPagination));
    expect(pagination).not.toBeNull('You should have a pagination');
    const element = fixture.nativeElement;
    const pageLinks = element.querySelectorAll('a.page-link');
    expect(pageLinks.length).toBe(4, 'You should have 2 pages, as the test uses 12 races');

    fixture.componentInstance.page = 2;
    fixture.detectChanges();

    const raceNamesPage2 = debugElement.queryAll(By.directive(RaceComponent));
    expect(raceNamesPage2.length).toBe(2, 'You should have 2 `RaceComponent` displayed on the 2nd page, as the test uses 12 races');
    expect(raceNamesPage2[0].componentInstance.raceModel.name).toBe('Berlin', 'You should display the second page races');
  });

  it('should not display a link to bet on a race', () => {
    const fixture = TestBed.createComponent(FinishedRacesComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement;
    const raceNames = element.querySelectorAll('a:not(.page-link)');
    expect(raceNames.length).toBe(0, 'You must NOT have a link to go to the bet page for each race');
  });
});
