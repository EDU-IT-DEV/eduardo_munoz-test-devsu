import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { InputComponent } from './input.component';
import { of } from 'rxjs';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputComponent],
      imports: [ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup({
      test: new FormControl('', [Validators.required, Validators.minLength(5)])
    });
    component.formName = 'test';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show required error message', () => {
    component.form.controls['test'].markAsTouched();
    fixture.detectChanges();
    expect(component.getErrorMessage).toBe('Este campo es obligatorio.');
  });

  it('should show minlength error message', () => {
    component.form.controls['test'].setValue('abc');
    component.form.controls['test'].markAsTouched();
    fixture.detectChanges();
    expect(component.getErrorMessage).toContain('El campo debe tener al menos');
  });

  it('should display input field', () => {
    component.label = 'Test Input';
    component.placeholder = 'Enter test value';
    fixture.detectChanges();
    const inputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement).toBeTruthy();
    expect(inputElement.getAttribute('placeholder')).toBe('Enter test value');
  });

  it('should validate invalidId', () => {
    component.form.controls['test'].setValue('invalid');
    component.form.controls['test'].markAsTouched();
    component.form.controls['test'].setErrors({ invalidId: true });
    fixture.detectChanges();
    expect(component.getErrorMessage).toBe('El ID ya existe o no es válido.');
  });

  it('should handle custom ID existence check', () => {
    component.checkIdExistence = (id: string) => of(id === 'existing');
    component.form.controls['test'].setValue('existing');
    fixture.detectChanges();
    expect(component.getErrorMessage).toBe('El ID ya existe o no es válido.');
  });

  it('should disable input when disabled is true', () => {
    component.disabled = true;
    fixture.detectChanges();
    const inputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.disabled).toBeTrue();
  });

  it('should be readonly when isReadOnly is true', () => {
    component.isReadOnly = true;
    fixture.detectChanges();
    const inputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.readOnly).toBeTrue();
  });
});
