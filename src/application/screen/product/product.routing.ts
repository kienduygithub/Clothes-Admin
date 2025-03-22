import { Routes } from "@angular/router";
import { CRUProductComponent } from "./comp/cru-product/cru-product.component";

export const ProductUrl = {
    PRODUCT_LIST: 'owner/products/list',
    PRODUCT_CREATE: 'owner/products/create',
    PRODUCT_VIEW: 'owner/products/view'
}

export const ProductRouting: Routes = [
    {
        path: ProductUrl.PRODUCT_CREATE,
        component: CRUProductComponent
    },
    {
        path: ProductUrl.PRODUCT_VIEW,
        component: CRUProductComponent
    }
];