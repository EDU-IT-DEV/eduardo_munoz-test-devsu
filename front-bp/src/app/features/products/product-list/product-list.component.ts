import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../interfaces/product.interface';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  itemsPerPage: number = 5;
  currentPage: number = 1;
  results: number = 0;
  filterValue: string = '';
  showMenu: { [key: string]: boolean } = {};
  isModalOpen: boolean = false;
  currentProductName: string = '';
  currentProductId: string | null = null;

  get items(): Product[] {
    const firstItem = (this.currentPage - 1) * this.itemsPerPage;
    const lastItem = firstItem + this.itemsPerPage;
    return this.filteredProducts.slice(firstItem, lastItem);
  }

  get filteredProducts() {
    return this.products.filter((item) =>
      item.name.toLowerCase().includes(this.filterValue.trim().toLowerCase())
    );
  }

  get hasNextPage() {
    return this.currentPage * this.itemsPerPage < this.filteredProducts.length;
  }

  get hasPreviousPage() {
    return this.currentPage > 1;
  }

  inputsConfig = [
    { formName: 'id', label: 'ID', disabled: false },
    { formName: 'name', label: 'Nombre' },
    { formName: 'description', label: 'Descripción' },
    { formName: 'logo', label: 'Logo' },
    { formName: 'date_release', label: 'Fecha Liberación', type: 'date' },
    {
      formName: 'date_revision',
      label: 'Fecha Revisión',
      disabled: true,
      type: 'date',
    },
  ];

  constructor(private router: Router, private productService: ProductService) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
      this.results = products.length;
    });
  }

  navigateToAdd() {
    this.router.navigate(['/products/add']);
  }



  onDelete(id: string, name: string): void {
    this.currentProductId = id;
    this.currentProductName = name;
    this.openModal();
}

deleteConfirmed(): void {
    if (this.currentProductId) {
        this.productService
            .deleteProduct(this.currentProductId)
            .pipe(
                finalize(() => {
                    this.getProducts();
                    this.closeModal();
                })
            )
            .subscribe();
    }
}

  onEdit(product: Product) {
    this.router.navigate(['/products/edit'], {
      queryParams: { product: JSON.stringify(product) },
    });
  }


  toggleMenu(product: { id: string }) {
    this.showMenu[product.id] = !this.showMenu[product.id];
  }

  openModal(): void {
    this.isModalOpen = true;
}

closeModal(): void {
    this.isModalOpen = false;
    this.currentProductId = null;
    this.currentProductName = '';
}
}
