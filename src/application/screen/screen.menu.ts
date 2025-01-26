export const MENU_ITEMS: any[] = [
    {
        title: 'Tổng quan',
        icon: { icon: 'dashboard_icon', pack: 'mainIcon' },
        link: '/',
    },
    {
        title: 'Quản lý mạng',
        icon: { icon: 'reports_icon', pack: 'mainIcon' },
        link: '/network-management',
    },
    {
        title: 'Cấu hình mạng',
        icon: { icon: 'network_icon', pack: 'mainIcon' },
        link: '/network',
        pathMatch: 'prefix',
        children: [
            {
                icon: { icon: 'dot_icon', pack: 'mainIcon' },
                title: 'Giao diện mạng',
                link: '/network/interface',
                pathMatch: 'prefix'
            },
            {
                icon: { icon: 'dot_icon', pack: 'mainIcon' },
                title: 'Định tuyến',
                link: '/network/routing',
                pathMatch: 'prefix'
            },
            {
                icon: { icon: 'dot_icon', pack: 'mainIcon' },
                title: 'DHCP và DNS',
                link: '/network/dhcp-dns',
                pathMatch: 'prefix'
            },
            {
                icon: { icon: 'dot_icon', pack: 'mainIcon' },
                title: 'Static lease',
                link: '/network/static-lease',
                pathMatch: 'prefix'
            }
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
