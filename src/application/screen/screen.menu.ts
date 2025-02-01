export const MENU_ITEMS: any[] = [
    {
        title: 'Tổng quan',
        icon: { icon: 'dashboard_icon', pack: 'mainIcon' },
        link: '/overview',
    },
    {
        title: 'Nhân sự',
        icon: { icon: 'group_icon', pack: 'mainIcon' },
        link: '/employee',
        children: [
            {
                icon: { icon: 'dot_icon', pack: 'mainIcon' },
                title: 'Danh sách nhân sự',
                link: '/employee/lists',
            },
            {
                icon: { icon: 'dot_icon', pack: 'mainIcon' },
                title: 'Phân quyền',
                link: '/employee/access',
                pathMatch: 'prefix'
            },
        ],
    },
    {
        title: 'Sản phẩm',
        icon: { icon: 'network_icon', pack: 'mainIcon' },
        link: '/shop/product',
        pathMatch: 'prefix',
        children: [
            {
                icon: { icon: 'dot_icon', pack: 'mainIcon' },
                title: 'Danh sách sản phẩm',
                link: '/shop/product/products',
                pathMatch: 'prefix'
            },
            {
                icon: { icon: 'dot_icon', pack: 'mainIcon' },
                title: 'Danh sách biến thể',
                link: '/shop/product/variants',
                pathMatch: 'prefix'
            },
            {
                icon: { icon: 'dot_icon', pack: 'mainIcon' },
                title: 'Danh mục sản phẩm',
                link: '/shop/product/category',
                pathMatch: 'prefix'
            },
        ],
    },
    {
        title: 'Firewall',
        icon: { icon: 'firewall_icon', pack: 'mainIcon' },
        link: '/firewall',
        children: [
            {
                icon: { icon: 'dot_icon', pack: 'mainIcon' },
                title: 'Firewall',
                link: '/firewall/dashboard',
            },
            {
                icon: { icon: 'dot_icon', pack: 'mainIcon' },
                title: 'Port forward',
                link: '/firewall/port-forward',
                pathMatch: 'prefix'
            },
            {
                icon: { icon: 'dot_icon', pack: 'mainIcon' },
                title: 'Traffic rule',
                link: '/firewall/traffic-rule',
                pathMatch: 'prefix'
            },
            {
                icon: { icon: 'dot_icon', pack: 'mainIcon' },
                title: 'NAT rule',
                link: '/firewall/nat-rule',
                pathMatch: 'prefix'
            },
            {
                icon: { icon: 'dot_icon', pack: 'mainIcon' },
                title: 'Schedule',
                link: '/firewall/schedule',
                pathMatch: 'prefix'
            },
        ],
    },
    {
        title: 'VPN',
        icon: { icon: 'vpn_icon', pack: 'mainIcon' },
        link: '/vpn',
    },
    {
        title: 'Hệ thống',
        icon: { icon: 'system_icon', pack: 'mainIcon' },
        link: '/system',
    },
];
