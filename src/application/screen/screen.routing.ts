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
import { OverviewRouting, OverviewUrl } from './overview/overview.routing';
import { AdminOverviewComponent } from './overview/admin/admin-overview.component';
import { OwnerOverviewComponent } from './overview/owner/owner-overview.component';
import { AccountUrl } from './account/account.routing';
import { OwnerChangePassswordComponent } from './account/owner/change-password/change-password.component';
import { OwnerAccountInfoComponent } from './account/owner/account-info/account-info.component';
import { AdminAccountInfoComponent } from './account/admin/account-info/account-info.component';
import { AdminChangePassswordComponent } from './account/admin/change-password/change-password.component';
import { OrderRouting, OrderURL } from './order/order.routing';
import { OrderComponent } from './order/order.component';
import { BalanceComponent } from './account/balance/balance.component';
import { StatsUrl } from './stats/stats.routing';
import { OwnerStatsComponent } from './stats/owner/owner-stats.component';
import { AdminStatsComponent } from './stats/admin/admin-stats.component';
import { ChatMessageUrl } from './chat-message/chat-message.routing';
import { ChatMessageComponent } from './chat-message/chat-message.component';

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
            ...OrderRouting,
            ...OverviewRouting,
            {
                path: 'admin',
                redirectTo: OverviewUrl.ADMIN_OVERVIEW,
                pathMatch: 'full'
            },
            {
                path: OverviewUrl.ADMIN_OVERVIEW,
                component: AdminOverviewComponent,
                title: 'Tổng quan'
            },
            {
                path: 'owner',
                redirectTo: OverviewUrl.OWNER_OVERVIEW,
                pathMatch: 'full'
            },
            {
                path: StatsUrl.ADMIN_STATS,
                component: AdminStatsComponent,
                title: 'Fashion Zone'
            },
            {
                path: OverviewUrl.OWNER_OVERVIEW,
                component: OwnerOverviewComponent,
                title: 'Fashion Zone'
            },
            {
                path: StatsUrl.OWNER_STATS,
                component: OwnerStatsComponent,
                title: 'Fashion Zone'
            },
            {
                path: 'owner/products',
                redirectTo: ProductUrl.PRODUCT_LIST,
                pathMatch: 'full'
            },
            {
                path: ProductUrl.PRODUCT_LIST,
                component: ProductComponent,
                title: 'Fashion Zone',
            },
            {
                path: 'admin/employee',
                redirectTo: EmployeeUrl.EMPLOYEE_LIST,
                pathMatch: 'full'
            },
            {
                path: EmployeeUrl.EMPLOYEE_LIST,
                component: EmployeeComponent,
                title: 'Fashion Zone',
            },
            {
                path: 'admin/shop',
                redirectTo: ShopURL.SHOP_URL,
                pathMatch: 'full'
            },
            {
                path: ShopURL.SHOP_URL,
                component: ShopComponent,
                title: 'Fashion Zone'
            },
            {
                path: RegisterShopURL.REGISTER_SHOP_URL,
                component: RegisterShopComponent,
                title: 'Fashion Zone'
            },
            {
                path: 'owner/coupon',
                redirectTo: CouponUrl.COUPON_LIST_URL,
                pathMatch: 'full',
            },
            {
                path: CouponUrl.COUPON_LIST_URL,
                component: CouponComponent,
                title: 'Fashion Zone'
            },
            {
                path: 'admin/category',
                redirectTo: CategoryUrl.CATEGORY_URL,
                pathMatch: 'full'
            },
            {
                path: CategoryUrl.CATEGORY_URL,
                component: CategoryComponent,
                title: 'Fashion Zone'
            },
            {
                path: AccountUrl.OWNER_ACCOUNT,
                redirectTo: '/' + AccountUrl.OWNER_ACCOUNT_INFO,
                pathMatch: 'full'
            },
            {
                path: AccountUrl.OWNER_ACCOUNT_INFO,
                component: OwnerAccountInfoComponent,
                title: 'Fashion Zone'
            },
            {
                path: AccountUrl.OWNER_ACCOUNT_CHANGE_PASSWORD,
                component: OwnerChangePassswordComponent,
                title: 'Fashion Zone'
            },
            {
                path: AccountUrl.ADMIN_ACCOUNT,
                redirectTo: '/' + AccountUrl.ADMIN_ACCOUNT_INFO,
                pathMatch: 'full'
            },
            {
                path: AccountUrl.ADMIN_ACCOUNT_INFO,
                component: AdminAccountInfoComponent,
                title: 'Fashion Zone'
            },
            {
                path: AccountUrl.ADMIN_ACCOUNT_CHANGE_PASSWORD,
                component: AdminChangePassswordComponent,
                title: 'Fashion Zone'
            },
            {
                path: AccountUrl.OWNER_BALANCE_ACCOUNT,
                component: BalanceComponent,
                title: 'Fashion Zone'
            },
            {
                path: OrderURL.ORDER,
                redirectTo: '/' + OrderURL.LIST_ORDER,
                pathMatch: 'full'
            },
            {
                path: OrderURL.LIST_ORDER,
                component: OrderComponent,
                title: 'Fashion Zone'
            },
            {
                path: ChatMessageUrl.CHAT_MESSAGE,
                component: ChatMessageComponent,
                title: 'Fashion Zone'
            }
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ScreenRouting { }
