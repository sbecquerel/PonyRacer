import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';

import { PendingRacesComponent } from './pending-races.component';
import { RacesModule } from '../races.module';
import { RaceComponent } from '../../race/race.component';

describe('PendingRacesComponent', () => {
  const activatedRoute = {
    snapshot: {
      data: {
        races: [
          { name: 'Lyon' },
          { name: 'Los Angeles' },
          { name: 'Sydney' },
          { name: 'Tokyo' },
          { name: 'Casablanca' }
        ]
      }
    }
  };

  beforeEach(() => TestBed.configureTestingModule({
    imports: [RacesModule, RouterTestingModule],
    providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
  }));

  it('should display every race name in a title', () => {
    const fixture = TestBed.createComponent(PendingRacesComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.races).not.toBeNull('You need to have a field `races` initialized with 5 races');
    expect(fixture.componentInstance.races.length).toBe(5, 'You need to have a field `races` initialized with 5 races');
    expect(fixture.componentInstance.races[0].name).toBe('Lyon');
    expect(fixture.componentInstance.races[1].name).toBe('Los Angeles');
    expect(fixture.componentInstance.races[2].name).toBe('Sydney');
    expect(fixture.componentInstance.races[3].name).toBe('Tokyo');
    expect(fixture.componentInstance.races[4].name).toBe('Casablanca');

    const debugElement = fixture.debugElement;
    const raceNames = debugElement.queryAll(By.directive(RaceComponent));
    expect(raceNames.length).toBe(4, 'You should have four `RaceComponent` displayed, use the `slice` pipe');
  });

  it('should display a link to bet on a race', () => {
    const fixture = TestBed.createComponent(PendingRacesComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement;
    const raceNames = element.querySelectorAll('a');
    expect(raceNames.length).toBe(4, 'You must have a link to go to the bet page for each race');
    expect(raceNames[0].textContent).toContain('Bet on Lyon');
    expect(raceNames[1].textContent).toContain('Bet on Los Angeles');
    expect(raceNames[2].textContent).toContain('Bet on Sydney');
    expect(raceNames[3].textContent).toContain('Bet on Tokyo');
  });
});
