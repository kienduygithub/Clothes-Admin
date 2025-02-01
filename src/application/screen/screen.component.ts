import { Component } from "@angular/core";
import { NbIconLibraries, NbMenuItem } from "@nebular/theme";
import { ImageResource } from "../common/resource/image_resource";
import { MENU_ITEMS } from "./screen.menu";
import { BaseLayoutComponent } from "../common/layout/base/base.layout";

@Component({
    selector: 'app-root',
    template: `
        <base-layout [menu]="menu">
            <nb-menu id="nb-menu" [items]="menu"></nb-menu>
            <router-outlet></router-outlet>
        </base-layout>
    `,
})
export class ScreenComponent {
    menu: NbMenuItem[] = [];

    constructor(private iconLibrary: NbIconLibraries) {
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

    ngOnInit(): void {
        this.menu = MENU_ITEMS;
    }
}