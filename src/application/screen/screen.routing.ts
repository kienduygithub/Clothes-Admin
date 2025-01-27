import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ScreenComponent } from './screen.component';
import { ProductRouting } from './product/product.routing';
import { ProductComponent } from './product/product.component';

const routes: Routes = [
    {
        path: '',
        component: ScreenComponent,
        children: [
            ...ProductRouting,
            {
                path: 'shop/product',
                redirectTo: '/shop/product/products',
                pathMatch: 'full'
            },
            {
                path: 'shop/product/products',
                component: ProductComponent
            }
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ScreenRouting { }
