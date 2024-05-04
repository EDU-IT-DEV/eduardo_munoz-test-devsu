import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductFormEditorComponent } from './product-form-editor/product-form-editor.component';

const routes: Routes = [
  { path: 'add', component: ProductFormEditorComponent },
  { path: 'edit', component: ProductFormEditorComponent },
  { path: '', component: ProductListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
