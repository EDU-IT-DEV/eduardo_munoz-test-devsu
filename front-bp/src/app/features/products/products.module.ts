import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductFormEditorComponent } from './product-form-editor/product-form-editor.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';

@NgModule({
  declarations: [
    ProductListComponent,
    ProductFormEditorComponent,
    ConfirmationModalComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,

    ProductsRoutingModule,
    SharedModule
  ]
})
export class ProductsModule { }
