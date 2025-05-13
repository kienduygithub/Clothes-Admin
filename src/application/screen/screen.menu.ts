import { CategoryUrl } from "./category/category.routing";
import { CouponUrl } from "./coupon/coupon.routing";
import { EmployeeUrl } from "./employee/employee.routing";
import { OverviewUrl } from "./overview/overview.routing";
import { ProductUrl } from "./product/product.routing";
import { RegisterShopURL } from "./register-shop/register-shop.routing";

export const ADMIN_MENU_ITEMS: any[] = [
    {
        title: 'Tổng quan',
        icon: { icon: 'dashboard_icon', pack: 'mainIcon' },
        link: '/' + OverviewUrl.ADMIN_OVERVIEW,
        pathMatch: 'prefix',
    },
    {
        title: 'Nhân sự',
        icon: { icon: 'icon_groups', pack: 'mainIcon' },
        link: '/' + EmployeeUrl.EMPLOYEE_LIST,
        pathMatch: 'prefix',
    },
    {
        icon: { icon: 'network_icon', pack: 'mainIcon' },
        title: 'Danh mục',
        link: '/' + CategoryUrl.CATEGORY_URL,
        patchMatch: 'prefix'
    },
    {
        title: 'Cửa hàng',
        icon: { icon: 'reports_icon', pack: 'mainIcon' },
        link: '/admin/shop',
        pathMatch: 'prefix',
        children: [
            {
                title: 'Danh sách cửa hàng',
                link: '/admin/shop/applied/list',
                pathMatch: 'prefix'
            },
            {
                title: 'Danh sách xét duyệt',
                link: '/' + RegisterShopURL.REGISTER_SHOP_URL,
                pathMatch: 'prefix'
            },
        ],
    },
]

export const OWNER_MENU_ITEMS: any[] = [
    {
        title: 'Tổng quan',
        icon: { icon: 'dashboard_icon', pack: 'mainIcon' },
        link: '/' + OverviewUrl.OWNER_OVERVIEW,
        pathMatch: 'prefix',
    },
    {
        title: 'Sản phẩm',
        icon: { icon: 'network_icon', pack: 'mainIcon' },
        link: '/' + ProductUrl.PRODUCT_LIST,
        pathMatch: 'prefix',
    },
    {
        title: 'Khuyến mãi',
        icon: { icon: 'firewall_icon', pack: 'mainIcon' },
        link: '/' + CouponUrl.COUPON_LIST_URL,
        pathMatch: 'prefix'
    },
];