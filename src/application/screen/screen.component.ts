import { Component } from "@angular/core";
import { NbIconLibraries, NbMenuItem } from "@nebular/theme";
import { ImageResource } from "../common/resource/image_resource";
import { MENU_ITEMS } from "./screen.menu";
import { BaseLayoutComponent } from "../common/layout/base/base.layout";
import { AuthManagement } from "../data/management/auth.management";
import { AppConfig } from "../common/config/app.config";
import { Router } from "@angular/router";

@Component({
    selector: 'app-root',
    template: `
        <base-layout [menu]="menu">
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
        private router: Router
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
        this.menu = MENU_ITEMS;
        await this.fetchDetailUser();
    }

    async fetchDetailUser() {
        try {
            const info = this.appConfig.getUserInfo();
            const id = info.id;
            const response = await this.authManagement.fetchUserDetails(id);
        } catch (error) {
            console.log(error);
        }
    }
}