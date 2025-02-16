import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ScreenComponent } from './screen.component';
import { ProductRouting } from './product/product.routing';
import { ProductComponent } from './product/product.component';
import { EmployeeRouting } from './employee/employee.routing';
import { EmployeeComponent } from './employee/employee.component';
import { ShopComponent } from './shop/shop.component';
import { ShopRouting, ShopURL } from './shop/shop.routing';
import { CategoryRouting, CategoryUrl } from './category/category.routing';
import { CategoryComponent } from './category/category.component';

const routes: Routes = [
    {
        path: '',
        component: ScreenComponent,
        children: [
            ...ShopRouting,
            ...EmployeeRouting,
            ...ProductRouting,
            ...CategoryRouting,
            {
                path: 'shop/product',
                redirectTo: '/shop/product/products',
                pathMatch: 'full'
            },
            {
                path: 'shop/product/products',
                title: 'Sản phẩm',
                component: ProductComponent,
                pathMatch: 'prefix'
            },
            {
                path: 'employee',
                redirectTo: '/employee/list',
                pathMatch: 'full'
            },
            {
                path: 'employee/list',
                title: 'Nhân sự',
                component: EmployeeComponent,
                pathMatch: 'prefix'
            },
            {
                path: 'shop',
                redirectTo: '/shop/list',
                pathMatch: 'full'
            },
            {
                path: ShopURL.SHOP_URL,
                component: ShopComponent,
                title: 'Cửa hàng',
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
