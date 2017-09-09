import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'pr-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  @Input() type = 'warning';
  @Input() dismissible = true;
  @Output() close = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  closeHandler() {
    this.close.emit();
  }

  get alertClasses() {
    return `alert alert-${this.type}`;
  }
 }
