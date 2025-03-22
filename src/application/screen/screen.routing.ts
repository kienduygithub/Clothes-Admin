import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ScreenComponent } from './screen.component';
import { ProductRouting, ProductUrl } from './product/product.routing';
import { ProductComponent } from './product/product.component';
import { EmployeeRouting, EmployeeUrl } from './employee/employee.routing';
import { EmployeeComponent } from './employee/employee.component';
import { ShopComponent } from './shop/shop.component';
import { ShopRouting, ShopURL } from './shop/shop.routing';
import { CategoryRouting, CategoryUrl } from './category/category.routing';
import { CategoryComponent } from './category/category.component';
import { AuthGuard } from '../common/config/guard.config';
import { RegisterShopRouting, RegisterShopURL } from './register-shop/register-shop.routing';
import { RegisterShopComponent } from './register-shop/register-shop.component';
import { CouponRouting, CouponUrl } from './coupon/coupon.routing';
import { CouponComponent } from './coupon/coupon.component';

const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: ScreenComponent,
        children: [
            ...ShopRouting,
            ...RegisterShopRouting,
            ...CouponRouting,
            ...EmployeeRouting,
            ...ProductRouting,
            ...CategoryRouting,
            {
                path: 'owner/products',
                redirectTo: ProductUrl.PRODUCT_LIST,
                pathMatch: 'full'
            },
            {
                path: ProductUrl.PRODUCT_LIST,
                title: 'Sản phẩm',
                component: ProductComponent,
            },
            {
                path: 'admin/employee',
                redirectTo: EmployeeUrl.EMPLOYEE_LIST,
                pathMatch: 'full'
            },
            {
                path: EmployeeUrl.EMPLOYEE_LIST,
                title: 'Nhân sự',
                component: EmployeeComponent,
            },
            {
                path: 'admin/shop',
                redirectTo: ShopURL.SHOP_URL,
                pathMatch: 'full'
            },
            {
                path: ShopURL.SHOP_URL,
                component: ShopComponent,
                title: 'Cửa hàng',
            },
            {
                path: RegisterShopURL.REGISTER_SHOP_URL,
                component: RegisterShopComponent,
                title: 'Danh sách xét duyệt'
            },
            {
                path: 'owner/coupon',
                redirectTo: CouponUrl.COUPON_LIST_URL,
                pathMatch: 'full',
            },
            {
                path: CouponUrl.COUPON_LIST_URL,
                component: CouponComponent,
                title: 'Khuyến mãi'
            },
            {
                path: 'admin/category',
                redirectTo: CategoryUrl.CATEGORY_URL,
                pathMatch: 'full'
            },
            {
                path: CategoryUrl.CATEGORY_URL,
                component: CategoryComponent,
                title: 'Danh mục'
            }
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ScreenRouting { }
