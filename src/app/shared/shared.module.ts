import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alert/alert.component';
import { FormControlValidationDirective } from './form-control-validation.directive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    NgbModule.forRoot()
  ],
  declarations: [
    AlertComponent,
    FormControlValidationDirective
  ],
  exports: [
    AlertComponent,
    FormControlValidationDirective,
    NgbModule
  ]
})
export class SharedModule { }
