import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { FormControlValidationDirective } from './form-control-validation.directive';

@Component({
  template: `
    <form [formGroup]="userForm">
      <div class="form-group row">
        <label for="lastName" class="col-sm-2 col-form-label">Name</label>
        <div class="col-sm-10">
          <input class="form-control" id="lastName" placeholder="Name" formControlName="lastName">
        </div>
      </div>
    </form>`
})
class FormComponent {
  userForm = new FormGroup({
    lastName: new FormControl('', Validators.required)
  });
}

describe('FormControlValidationDirective', () => {

  beforeEach(() => TestBed.configureTestingModule({
    imports: [ReactiveFormsModule],
    declarations: [FormComponent, FormControlValidationDirective]
  }));

  it('should add the has-danger CSS class', () => {
    const fixture = TestBed.createComponent(FormComponent);
    fixture.detectChanges();

    const directive = fixture.debugElement.query(By.directive(FormControlValidationDirective));
    expect(directive).not.toBeNull('The directive should be applied to an element with a class form-group');

    const lastName = fixture.nativeElement.querySelector('#lastName');
    lastName.value = '';
    lastName.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    const group = fixture.nativeElement.querySelector('.form-group');
    expect(group.classList).toContain('has-danger');
  });
});
