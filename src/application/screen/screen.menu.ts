import { CategoryUrl } from "./category/category.routing";
import { EmployeeUrl } from "./employee/employee.routing";
import { RegisterShopURL } from "./register-shop/register-shop.routing";
import { ShopURL } from "./shop/shop.routing";

export const MENU_ITEMS: any[] = [
    {
        title: 'Tổng quan',
        icon: { icon: 'dashboard_icon', pack: 'mainIcon' },
        link: '/overview',
    },
    {
        title: 'Nhân sự',
        icon: { icon: 'group_icon', pack: 'mainIcon' },
        link: EmployeeUrl.EMPLOYEE_LIST,
        pathMatch: 'prefix',
    },
    {
        title: 'Sản phẩm',
        icon: { icon: 'network_icon', pack: 'mainIcon' },
        link: '/shop/product',
        children: [
            {
                icon: { icon: 'dot_icon', pack: 'mainIcon' },
                title: 'Danh sách sản phẩm',
                link: '/shop/product/products',
                pathMatch: 'prefix'
            },
            {
                icon: { icon: 'dot_icon', pack: 'mainIcon' },
                title: 'Danh mục sản phẩm',
                link: CategoryUrl.CATEGORY_URL,
                pathMatch: 'prefix'
            },
        ],
    },
    {
        title: 'Cửa hàng',
        icon: { icon: 'firewall_icon', pack: 'mainIcon' },
        link: '/shop',
        children: [
            {
                icon: { icon: 'dot_icon', pack: 'mainIcon' },
                title: 'Danh sách cửa hàng',
                link: ShopURL.SHOP_URL,
                pathMatch: 'prefix'
            },
            {
                icon: { icon: 'dot_icon', pack: 'mainIcon' },
                title: 'Đăng ký cửa hàng',
                link: RegisterShopURL.REGISTER_SHOP_URL,
                pathMatch: 'prefix'
            },
        ],
    },
    // {
    //     title: 'VPN',
    //     icon: { icon: 'vpn_icon', pack: 'mainIcon' },
    //     link: '/vpn',
    // },
    // {
    //     title: 'Hệ thống',
    //     icon: { icon: 'system_icon', pack: 'mainIcon' },
    //     link: '/system',
    // },
];
