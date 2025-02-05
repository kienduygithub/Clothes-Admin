import { Component, OnInit } from "@angular/core";
import { ShopManagement } from "../../../../data/management/shop.management";
import { ShopService } from "../../../../data/service/shop.service";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";

@Component({
    standalone: true,
    selector: 'shop-list-component',
    templateUrl: './shop-list.component.html',
    styleUrl: './shop-list.component.scss',
    imports: [
        CommonModule
    ],
    providers: [
        ShopManagement,
        ShopService
    ]
})

export class ShopListComponent implements OnInit {

    constructor(
        private router: Router,
        private shopManagement: ShopManagement
    ) { }

    async ngOnInit() {

    }
}