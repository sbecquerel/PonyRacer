import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { AlertComponent } from './alert.component';

@Component({
  template: `<ngb-alert (close)="closed = true; event = $event">Hello</ngb-alert>`
})
class FakeComponent {
  closed = false;
  event = null;
}

describe('AlertComponent', () => {

  beforeEach(() => TestBed.configureTestingModule({
    declarations: [FakeComponent, AlertComponent]
  }));

  it('should be created with default values', () => {
    const fixture = TestBed.createComponent(AlertComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    expect(component.type).toBe('warning', 'The type input should be `warning` by default');
    expect(component.dismissible).toBe(true, 'The dismissible input should be `true` by default');
  });

  it('should have a content', () => {
    const fixture = TestBed.createComponent(FakeComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement;

    expect(element.textContent).toContain('Hello', 'The AlertComponent should use `ng-content`');
  });

  it('should compute the classes to apply', () => {
    const component = new AlertComponent();

    expect(component.alertClasses).toBe('alert alert-warning', 'The alertClasses getter should depend on the type');

    component.type = 'danger';
    expect(component.alertClasses).toBe('alert alert-danger', 'The alertClasses getter should depend on the type');
  });

  it('should apply the classes on the root element', () => {
    const fixture = TestBed.createComponent(FakeComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement;
    const div = element.querySelector('div');
    expect(div.className).toContain('alert alert-warning', 'The alertClasses should be applied on the root element');
  });

  it('should emit a close event', () => {
    const fixture = TestBed.createComponent(FakeComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement;
    element.querySelector('button').dispatchEvent(new Event('click'));
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component.closed).toBe(true, 'You should emit an event on close');
    expect(component.event).toBeUndefined('The close event should emit a void event');
  });
});
