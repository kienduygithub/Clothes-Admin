import { Routes } from "@angular/router";
import { CRURegisterShopComponent } from "./comp/cru-register-shop/cru-register-shop.component";

export const RegisterShopURL = {
    REGISTER_SHOP_URL: 'shop/register/list',
    VIEW_REGISTER_SHOP_URL: 'shop/register/list/view'
}

export const RegisterShopRouting: Routes = [
    {
        path: RegisterShopURL.VIEW_REGISTER_SHOP_URL,
        component: CRURegisterShopComponent
    }
];