import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../services/product.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let router: Router;

  beforeEach(async () => {
    productService = jasmine.createSpyObj('ProductService', [
      'getProducts',
      'deleteProduct',
    ]);
    productService.getProducts.and.returnValue(of([
      { id: '1', name: 'Product 1', description: 'Description 1', logo: 'logo1.png', date_release: new Date(), date_revision: new Date() },
      { id: '2', name: 'Product 2', description: 'Description 2', logo: 'logo2.png', date_release: new Date(), date_revision: new Date() }
    ]));

    await TestBed.configureTestingModule({
      declarations: [ProductListComponent],
      imports: [RouterTestingModule],
      providers: [{ provide: ProductService, useValue: productService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get products on init', () => {
    component.ngOnInit();
    expect(productService.getProducts).toHaveBeenCalled();
    expect(component.products.length).toBe(2);
    expect(component.results).toBe(2);
  });

  it('should navigate to add product', () => {
    spyOn(router, 'navigate');
    component.navigateToAdd();
    expect(router.navigate).toHaveBeenCalledWith(['/products/add']);
  });

  it('should set current product and open modal on delete', () => {
    component.onDelete('1', 'Product 1');
    expect(component.currentProductId).toBe('1');
    expect(component.currentProductName).toBe('Product 1');
    expect(component.isModalOpen).toBeTrue();
  });

  it('should delete product when confirmed', () => {
    component.currentProductId = '1';
    component.deleteConfirmed();
    expect(productService.deleteProduct).toHaveBeenCalledWith('1');
  });

  it('should close modal', () => {
    component.closeModal();
    expect(component.isModalOpen).toBeFalse();
    expect(component.currentProductId).toBeNull();
    expect(component.currentProductName).toBe('');
  });

  it('should navigate to edit product', () => {
    spyOn(router, 'navigate');
    const product = { id: '1', name: 'Product 1', description: 'Description 1', logo: 'logo1.png', date_release: new Date(), date_revision: new Date() };
    component.onEdit(product);
    expect(router.navigate).toHaveBeenCalledWith(['/products/edit'], { queryParams: { product: JSON.stringify(product) } });
  });

  it('should filter products based on filter value', () => {
    component.filterValue = '1';
    expect(component.filteredProducts.length).toBe(1);
  });

  it('should return items for current page', () => {
    component.currentPage = 1;
    expect(component.items.length).toBeGreaterThan(0);
  });

  it('should toggle menu visibility for product', () => {
    component.toggleMenu({ id: '1' });
    expect(component.showMenu['1']).toBeTrue();
  });

  it('should check if has next page', () => {
    component.currentPage = 1;
    expect(component.hasNextPage).toBeFalse();
  });

  it('should check if has previous page', () => {
    component.currentPage = 2;
    expect(component.hasPreviousPage).toBeTrue();
  });
});
