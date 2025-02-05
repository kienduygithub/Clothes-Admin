import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ScreenComponent } from './screen.component';
import { ProductRouting } from './product/product.routing';
import { ProductComponent } from './product/product.component';
import { EmployeeRouting } from './employee/employee.routing';
import { EmployeeComponent } from './employee/employee.component';
import { ShopComponent } from './shop/shop.component';
import { ShopRouting } from './shop/shop.routing';

const routes: Routes = [
    {
        path: '',
        component: ScreenComponent,
        children: [
            ...ShopRouting,
            ...EmployeeRouting,
            ...ProductRouting,
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
                path: 'shop/list',
                component: ShopComponent,
                title: 'Cửa hàng',
            }
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ScreenRouting { }
