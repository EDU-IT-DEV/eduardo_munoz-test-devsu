import { Component, Input } from '@angular/core';
import { FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent {

  @Input() form!: FormGroup;
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() formName: string = '';
  @Input() type: string = 'text';
  @Input() isReadOnly: boolean = false;
  @Input() checkIdExistence: (id: string) => Observable<boolean> = () => of(false);

  get isInvalidField(): boolean {
    return (this.form.get(this.formName)?.touched && !this.form.get(this.formName)?.valid) as boolean;
  }

  get getErrorMessage(): string {
    const error = this.form.get(this.formName)?.errors;
    return error ? this.getValidationMessage(error) : '';
  }

  getValidationMessage(error: any): string {
    if (error.required) {
      return 'Este campo es obligatorio.';
    } else if (error.minlength) {
      return `El campo debe tener al menos ${error.minlength.requiredLength} caracteres.`;
    } else if (error.maxlength) {
      return `El campo no puede tener más de ${error.maxlength.requiredLength} caracteres.`;
    } else if (error.invalidId) {
      return 'El ID ya existe o no es válido.';
    } else if (error.minDate) {
      return 'La fecha debe ser igual o mayor a la fecha actual.';
    } else if (error.oneYearLater) {
      return 'La fecha debe ser exactamente un año posterior a la fecha de liberación.';
    } else if (error.email) {
      return 'El email ingresado no es válido.';
    }
    return '';
  }
}
