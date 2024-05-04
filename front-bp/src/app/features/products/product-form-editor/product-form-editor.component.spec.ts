import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ProductFormEditorComponent } from './product-form-editor.component';
import { ProductService } from '../services/product.service';
import { ActivatedRoute } from '@angular/router';

describe('ProductFormEditorComponent', () => {
  let component: ProductFormEditorComponent;
  let fixture: ComponentFixture<ProductFormEditorComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let route: ActivatedRoute;

  beforeEach(async () => {
    productService = jasmine.createSpyObj('ProductService', [
      'productExists',
      'updateProduct',
      'createProduct',
    ]);
    productService.productExists.and.returnValue(of(false));

    await TestBed.configureTestingModule({
      declarations: [ProductFormEditorComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        { provide: ProductService, useValue: productService },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ product: encodeURIComponent(JSON.stringify({
              id: 'test',
              name: 'Test Product',
              description: 'Test description',
              logo: 'test.png',
              date_release: new Date(),
              date_revision: new Date(),
            }))}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build form on initialization', () => {
    component.ngOnInit();
    expect(component.form).toBeTruthy();
    expect(component.form.controls['id'].value).toBe('test');
  });

  it('should reset form', () => {
    component.isEditMode = true;
    component.product = { id: 'test', name: '', description: '', logo: '', date_release: new Date(), date_revision: new Date() };
    component.resetForm();
    expect(component.form.get('id')?.value).toBe('test');
  });

  it('should handle form submission for creating a product', () => {
    component.form.controls['id'].setValue('test');
    component.form.controls['name'].setValue('Test Product');
    component.form.controls['description'].setValue('Test description');
    component.form.controls['logo'].setValue('test.png');
    component.form.controls['date_release'].setValue(new Date());
    component.form.controls['date_revision'].setValue(new Date());
    component.isEditMode = false;
    component.handleFormSubmission();
    expect(productService.createProduct).toHaveBeenCalled();
  });

  it('should handle form submission for updating a product', () => {
    component.form.controls['id'].setValue('test');
    component.form.controls['name'].setValue('Test Product');
    component.form.controls['description'].setValue('Test description');
    component.form.controls['logo'].setValue('test.png');
    component.form.controls['date_release'].setValue(new Date());
    component.form.controls['date_revision'].setValue(new Date());
    component.isEditMode = true;
    component.handleFormSubmission();
    expect(productService.updateProduct).toHaveBeenCalled();
  });

  it('should validate one year difference between dates', () => {
    component.form.controls['date_release'].setValue(new Date(2020, 5, 1).toISOString().split('T')[0]);
    component.form.controls['date_revision'].setValue(new Date(2021, 5, 1).toISOString().split('T')[0]);
    expect(component.form.errors).toBeNull();
  });

  it('should unsubscribe on destroy', () => {
    spyOn(component['subscription'], 'unsubscribe');
    component.ngOnDestroy();
    expect(component['subscription'].unsubscribe).toHaveBeenCalled();
  });

  it('should return error message for required field', () => {
    component.form.controls['name'].setValue('');
    component.form.controls['name'].markAsTouched();
    expect(component.getErrorMessage).toBe('Este campo es obligatorio.');
  });

  it('should return error message for minlength field', () => {
    component.form.controls['name'].setValue('a');
    component.form.controls['name'].markAsTouched();
    expect(component.getErrorMessage).toContain('El campo debe tener al menos');
  });

  it('should return true for isInvalidField when field is invalid', () => {
    component.form.controls['name'].setValue('');
    component.form.controls['name'].markAsTouched();
    expect(component.isInvalidField).toBeTrue();
  });
});
