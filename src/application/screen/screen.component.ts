import { Component, HostListener } from "@angular/core";
import { NbIconLibraries, NbMenuItem } from "@nebular/theme";
import { ImageResource } from "../common/resource/image_resource";
import { ADMIN_MENU_ITEMS, OWNER_MENU_ITEMS } from "./screen.menu";
import { AuthManagement } from "../data/management/auth.management";
import { AppConfig } from "../common/config/app.config";
import { Roles } from "../common/resource/roles";
import { WebSocketService } from "../common/service/websocket.service";

@Component({
    selector: 'app-root',
    template: `
        <base-layout [menu]="menu" windowMode>
            <nb-menu id="nb-menu" [items]="menu"></nb-menu>
            <router-outlet></router-outlet>
        </base-layout>
    `,
    providers: [
        AuthManagement
    ]
})
export class ScreenComponent {
    menu: NbMenuItem[] = [];

    constructor(
        private iconLibrary: NbIconLibraries,
        private authManagement: AuthManagement,
        private appConfig: AppConfig,
        private wsService: WebSocketService
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
            group_icon: ImageResource.icon_group
        });
    }

    async ngOnInit() {
        const info = this.appConfig.getUserInfo();
        if (info) {
            this.menu = info.roles === Roles.ADMIN
                ? ADMIN_MENU_ITEMS
                : OWNER_MENU_ITEMS;
        }
        info.roles === Roles.ADMIN
            ? this.wsService.connectWebSocket(info.id)
            : this.wsService.connectWebSocketShop(info.shopId);

        await this.fetchDetailUser(info.id);
    }

    @HostListener('window:beforeunload', ['$event'])
    unloadHandler(event: Event) {
        const info = this.appConfig.getUserInfo();
        if (info) {
            if (info.roles === Roles.ADMIN) {
                this.wsService.disconnect(info.id);
            } else if (info.roles === Roles.OWNER) {
                this.wsService.disconnectShop(info.shopId);
            }
        }
    }

    async fetchDetailUser(id: number) {
        try {
            await this.authManagement.fetchUserDetails(id);
        } catch (error) {
            console.log(error);
        }
    }
}