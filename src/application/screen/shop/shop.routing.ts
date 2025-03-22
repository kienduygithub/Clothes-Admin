import { Routes } from "@angular/router";
import { CRUShopComponent } from "./admin/cru-shop/cru-shop.component";

export const ShopURL = {
    SHOP_URL: 'admin/shop/applied/list',
    CREATE_SHOP_URL: 'admin/shop/applied/create',
    EDIT_SHOP_URL: 'admin/shop/applied/view'
}

export const ShopRouting: Routes = [
    {
        path: ShopURL.CREATE_SHOP_URL,
        component: CRUShopComponent
    },
    {
        path: ShopURL.EDIT_SHOP_URL,
        component: CRUShopComponent
    }
];