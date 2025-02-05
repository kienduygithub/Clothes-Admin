import { Routes } from "@angular/router";
import { CRUShopComponent } from "./admin/cru-shop/cru-shop.component";

export const ShopRouting: Routes = [
    {
        path: 'shop/list/create',
        component: CRUShopComponent
    }
];