import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../interfaces/product.interface';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import {
  Subscription,
  debounceTime,
  distinctUntilChanged,
  finalize,
  switchMap,
} from 'rxjs';

@Component({
  selector: 'app-product-form-editor',
  templateUrl: './product-form-editor.component.html',
  styleUrls: ['./product-form-editor.component.css'],
})
export class ProductFormEditorComponent implements OnInit {
  @Input() title: string = 'Formulario de Registro';
  @Input() toBack: string = '/';

  private subscription: Subscription = new Subscription();

  product!: Product;

  form!: FormGroup;
  label = 'Campo';
  formName = 'name';
  type = 'text';
  placeholder = 'Ingrese texto';
  disabled = false;
  isEditMode: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getQueryParams();
  }

  get isInvalidField(): boolean {
    const control = this.form.get(this.formName);
    return control ? control.invalid && control.touched : false;
  }

  get getErrorMessage(): string {
    const control = this.form.get(this.formName);
    if (control && control.errors) {
      if (control.errors['required']) {
        return 'Este campo es obligatorio.';
      } else if (control.errors['minlength']) {
        return `El campo debe tener al menos ${control.errors['minlength'].requiredLength} caracteres.`;
      }
    }
    return '';
  }

  resetForm(): void {
    this.form.reset();
    if (this.isEditMode) {
      this.form.get('id')?.setValue(this.product.id);
    }
  }

  handleFormSubmission(): void {
    if (this.form.valid) {
      if (this.isEditMode) {
        this.updateProduct();
      } else {
        this.createProduct();
      }
    }
  }

  getQueryParams(): void {
    this.route.queryParams.subscribe((params) => {
      const productParam = params['product'];
      if (productParam) {
        this.product = JSON.parse(decodeURIComponent(productParam));
        this.form.patchValue({
          ...this.product,
          date_release: new Date(this.product.date_release)
            .toISOString()
            .split('T')[0],
          date_revision: new Date(this.product.date_revision)
            .toISOString()
            .split('T')[0],
        });
        this.isEditMode = true;
      }
    });
  }

  buildForm(): void {
    this.form = this.fb.group({
      id: [
        { value: '', disabled: !!this.isEditMode },
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
          this.idValidator(),
        ],
      ],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
      logo: ['', Validators.required],
      date_release: ['', [Validators.required, this.minDateValidator()]],
        date_revision: ['', [Validators.required]],
      },
      { validators: this.oneYearDifferenceValidator() });
  }

  oneYearDifferenceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const dateReleaseControl = control.get('date_release');
      const dateRevisionControl = control.get('date_revision');

      if (!dateReleaseControl || !dateRevisionControl) {
        return null;
      }

      const dateReleaseValue = dateReleaseControl.value;
      const dateRevisionValue = dateRevisionControl.value;

      if (!dateReleaseValue || !dateRevisionValue) {
        return null;
      }

      const dateRelease = new Date(dateReleaseValue);
      const dateRevision = new Date(dateRevisionValue);

      const differenceInYears =
        dateRevision.getFullYear() - dateRelease.getFullYear();

      if (
        differenceInYears === 1 &&
        dateRelease.getMonth() === dateRevision.getMonth() &&
        dateRelease.getDate() === dateRevision.getDate()
      ) {
        return null;
      }

      return { oneYearLater: true };
    };
  }

  minDateValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const [year, month, day] = control.value.split('-');
      const inputDate = new Date(Number(year), Number(month) - 1, Number(day));
      inputDate.setHours(12, 0, 0, 0); // a esto lo hago para que no haya problemas con la zona horaria
      const currentDate = new Date();
      currentDate.setHours(12, 0, 0, 0);  // idem
      return inputDate >= currentDate ? null : { minDate: true };
    };
  }

  updateProduct() {
    this.productService
      .updateProduct(this.form.value)
      .pipe(finalize(() => this.router.navigate(['/products'])))
      .subscribe();
  }

  createProduct() {
    this.productService
      .createProduct(this.form.value)
      .pipe(finalize(() => this.router.navigate(['/products'])))
      .subscribe();
  }

  idValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const id = control.value;

      if (id.length < 3 || id.length > 10) {
        return { invalidId: true };
      }

      if (this.subscription) {
        this.subscription.unsubscribe();
      }

      this.subscription = control.valueChanges
        .pipe(
          debounceTime(1000),
          distinctUntilChanged(),
          switchMap((id) => this.productService.productExists(id))
        )
        .subscribe((exists) => {
          if (exists) {
            control.setErrors({ invalidId: true });
          }
        });

      return null;
    };
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
