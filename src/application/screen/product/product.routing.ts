import { Routes } from "@angular/router";
import { CRUProductComponent } from "./comp/cru-product/cru-product.component";

export const ProductRouting: Routes = [
    {
        path: 'shop/product/products/create',
        component: CRUProductComponent
    }
];