import { Component, HostListener, OnDestroy } from "@angular/core";
import { NbIconLibraries, NbMenuItem, NbMenuService } from "@nebular/theme";
import { ImageResource } from "../common/resource/image_resource";
import { ADMIN_MENU_ITEMS, OWNER_MENU_ITEMS } from "./screen.menu";
import { AuthManagement } from "../data/management/auth.management";
import { AppConfig } from "../common/config/app.config";
import { Roles } from "../common/resource/roles";
import { WebSocketService } from "../common/service/websocket.service";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { UserStoreModel } from "../data/model/user/user.store.model";

@Component({
    selector: 'app-root',
    template: `
        <app-toast-notification></app-toast-notification>
        <base-layout [menu]="menu" windowMode>
            <nb-menu id="nb-menu" [items]="menu"></nb-menu>
            <router-outlet></router-outlet>
        </base-layout>
    `,
    providers: [
        AuthManagement
    ]
})
export class ScreenComponent implements OnDestroy {
    menu: NbMenuItem[] = [];
    private userSubscription!: Subscription;

    constructor(
        private iconLibrary: NbIconLibraries,
        private authManagement: AuthManagement,
        private appConfig: AppConfig,
        private wsService: WebSocketService,
        private router: Router,
        private menuService: NbMenuService
    ) {
        this.iconLibrary.registerSvgPack('mainIcon', {
            dashboard_icon: ImageResource.icon_dasb,
            edit_icon: ImageResource.edit_logo,
            icon_edit: ImageResource.icon_edit,
            icon_delete: ImageResource.icon_delete,
            firewall_icon: ImageResource.icon_firewall,
            network_icon: ImageResource.icon_network,
            reports_icon: ImageResource.icon_reports,
            system_icon: ImageResource.icon_system,
            vpn_icon: ImageResource.icon_vpn,
            dot_icon: ImageResource.dot_icon,
            network_appliances: ImageResource.network_appliances_icon,
            account_setting: ImageResource.account_icon,
            branches: ImageResource.branch_icon,
            app_internet_icon: ImageResource.app_internet_icon,
            tools_icon: ImageResource.tool_icon,
            icon_groups: ImageResource.icon_groups,
            icon_orders: ImageResource.icon_orders,
        });
    }

    async ngOnInit() {
        const info = this.appConfig.getUserInfo();
        if (info) {
            this.menu = info.roles === Roles.ADMIN
                ? ADMIN_MENU_ITEMS
                : OWNER_MENU_ITEMS;
        }

        this.userSubscription = this.authManagement.getSelectUser().subscribe(
            (user: UserStoreModel) => {
                if (user && user.id) {
                    if (user.roles === Roles.ADMIN) {
                        this.wsService.connectWebSocket(user.id)
                    } else if (user.roles === Roles.OWNER && user.shopId) {
                        this.wsService.connectWebSocketShop(user.shopId, user.id);
                    }
                }
            }
        )

        this.menuService.onSubmenuToggle().subscribe((event: { tag: string, item: NbMenuItem }) => {
            let selectedTabParent = event.item;
            let subMenuItems = event.item.children;

            if (
                subMenuItems &&
                subMenuItems.length > 0 &&
                !this.router.url.startsWith(`${selectedTabParent.link}`)
            ) {
                const firstTabMenuChild = subMenuItems[0];
                if (firstTabMenuChild.link) {
                    this.router.navigate([firstTabMenuChild.link]);
                }
            }
        })
        await this.fetchDetailUser(info.id);
    }

    @HostListener('window:beforeunload', ['$event'])
    unloadHandler(event: Event) {
        const info = this.appConfig.getUserInfo();
        this.wsService.disconnect();
    }

    async fetchDetailUser(id: number) {
        try {
            await this.authManagement.fetchUserDetails(id);
        } catch (error) {
            console.log(error);
        }
    }

    ngOnDestroy() {
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
        this.wsService.disconnect();
    }
}