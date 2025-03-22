import { CategoryUrl } from "./category/category.routing";
import { CouponUrl } from "./coupon/coupon.routing";
import { EmployeeUrl } from "./employee/employee.routing";
import { ProductUrl } from "./product/product.routing";
import { RegisterShopURL } from "./register-shop/register-shop.routing";
import { ShopURL } from "./shop/shop.routing";

export const MENU_ITEMS: any[] = [
    // {
    //     title: 'Tổng quan',
    //     icon: { icon: 'dashboard_icon', pack: 'mainIcon' },
    //     link: '/overview',
    // },
    {
        title: 'Nhân sự',
        icon: { icon: 'group_icon', pack: 'mainIcon' },
        link: '/' + EmployeeUrl.EMPLOYEE_LIST,
        pathMatch: 'prefix',
    },
    {
        title: 'Sản phẩm',
        icon: { icon: 'network_icon', pack: 'mainIcon' },
        link: '/owner/products',
        pathMatch: 'prefix',
        children: [
            {
                icon: { icon: 'dot_icon', pack: 'mainIcon' },
                title: 'Danh sách sản phẩm',
                link: '/' + ProductUrl.PRODUCT_LIST,
                pathMatch: 'prefix'
            },
        ],
    },
    {
        icon: { icon: 'network_icon', pack: 'mainIcon' },
        title: 'Danh mục',
        link: '/' + CategoryUrl.CATEGORY_URL,
        patchMatch: 'prefix'
    },
    {
        title: 'Cửa hàng',
        icon: { icon: 'firewall_icon', pack: 'mainIcon' },
        link: '/admin/shop',
        pathMatch: 'prefix',
        children: [
            {
                icon: { icon: 'dot_icon', pack: 'mainIcon' },
                title: 'Danh sách cửa hàng',
                link: '/admin/shop/applied/list',
                pathMatch: 'prefix'
            },
            {
                icon: { icon: 'dot_icon', pack: 'mainIcon' },
                title: 'Danh sách xét duyệt',
                link: '/' + RegisterShopURL.REGISTER_SHOP_URL,
                pathMatch: 'prefix'
            },
        ],
    },
    {
        title: 'Khuyến mãi',
        icon: { icon: 'group_icon', pack: 'mainIcon' },
        link: '/' + CouponUrl.COUPON_LIST_URL,
        pathMatch: 'prefix'
    },
    // {
    //     title: 'Hệ thống',
    //     icon: { icon: 'system_icon', pack: 'mainIcon' },
    //     link: '/system',
    // },
];
