import { Routes } from "@angular/router";
import { CRUShopComponent } from "./admin/cru-shop/cru-shop.component";

export const ShopURL = {
    SHOP_URL: 'shop/list',
    CREATE_SHOP_URL: 'shop/list/create',
    EDIT_SHOP_URL: 'shop/list/view'
}

export const ShopRouting: Routes = [
    {
        path: 'shop/list/create',
        component: CRUShopComponent
    }
];