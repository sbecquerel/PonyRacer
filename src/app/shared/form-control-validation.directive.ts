/* tslint:disable:directive-selector */
import { Directive, ContentChild, HostBinding } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '.form-group'
})
export class FormControlValidationDirective {

  constructor() { }

  @ContentChild(NgControl) ngControl: NgControl;

  @HostBinding('class.has-danger')
  get hasDanger() {
    return this.ngControl.dirty && this.ngControl.invalid;
  }
}
