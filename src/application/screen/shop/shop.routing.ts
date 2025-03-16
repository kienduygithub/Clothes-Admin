import { Routes } from "@angular/router";
import { CRUShopComponent } from "./admin/cru-shop/cru-shop.component";

export const ShopURL = {
    SHOP_URL: 'shop/applied/list',
    CREATE_SHOP_URL: 'shop/applied/list/create',
    EDIT_SHOP_URL: 'shop/applied/list/view'
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