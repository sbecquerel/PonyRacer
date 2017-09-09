import { Component, OnInit, OnDestroy } from '@angular/core';
import { RaceService } from '../race.service';
import { ActivatedRoute } from '@angular/router';
import { RaceModel } from '../models/race.model';
import { PonyWithPositionModel } from '../models/pony.model';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/groupBy';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/bufferToggle';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'pr-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css']
})
export class LiveComponent implements OnInit, OnDestroy {

  raceModel: RaceModel;
  poniesWithPosition: Array<PonyWithPositionModel> = [];
  positionSubscription;
  error = false;
  winners: Array<PonyWithPositionModel> = [];
  betWon;
  clickSubject: Subject<PonyWithPositionModel>;

  constructor(private raceService: RaceService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.raceModel = this.route.snapshot.data['race'];

    if (this.raceModel.status !== 'FINISHED') {
      this.positionSubscription = this.raceService.live(this.raceModel.id)
      .subscribe(
        poniesWithPosition => {
          this.raceModel.status = 'RUNNING';
          this.poniesWithPosition = poniesWithPosition;
        },
        () => this.error = true,
        () => {
          this.raceModel.status = 'FINISHED';
          this.winners = this.poniesWithPosition.filter((pony: PonyWithPositionModel) => pony.position >= 100);
          this.betWon = this.winners.some((pony: PonyWithPositionModel) => pony.id === this.raceModel.betPonyId);
        }
      );
    }

    this.clickSubject = new Subject();
    this.clickSubject
      .groupBy(pony => pony.id, pony => pony.id)
      .mergeMap(obs => obs.bufferToggle(obs, () => Observable.interval(1000)))
      .filter(res => res.length >= 5)
      .throttleTime(1000)
      .map(res => res[0])
      .switchMap(ponyId => this.raceService.boost(this.raceModel.id, ponyId).catch(() => Observable.empty()))
      .subscribe(() => {});
  }

  ngOnDestroy() {
    if (this.positionSubscription) {
      this.positionSubscription.unsubscribe();
    }
  }

  onClick(pony) {
    this.clickSubject.next(pony);
  }

  ponyById(index, pony) {
    return pony.id;
  }
}
