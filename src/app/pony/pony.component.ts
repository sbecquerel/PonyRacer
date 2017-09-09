import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PonyModel } from '../models/pony.model';

@Component({
  selector: 'pr-pony',
  templateUrl: './pony.component.html',
  styleUrls: ['./pony.component.css']
})
export class PonyComponent implements OnInit {

  @Input() ponyModel: PonyModel;
  @Input() isRunning = false;
  @Input() isBoosted = false;

  @Output() ponyClicked = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  getPonyImageUrl() {
    if (this.isBoosted) {
      return `assets/images/pony-${this.ponyModel.color.toLowerCase()}-rainbow.gif`;
    }
    if (this.isRunning) {
      return `assets/images/pony-${this.ponyModel.color.toLowerCase()}-running.gif`;
    }
    return `assets/images/pony-${this.ponyModel.color.toLowerCase()}.gif`;
  }

  clicked() {
    this.ponyClicked.emit(this.ponyModel);
  }
}
