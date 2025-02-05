import { Component, OnInit } from "@angular/core";
import { ShopListComponent } from "./admin/shop-list/shop-list.component";
import { Router } from "@angular/router";
import { NbButtonModule, NbInputModule } from "@nebular/theme";
import { CommonModule } from "@angular/common";

const NB_LIBS = [
    NbInputModule,
    NbButtonModule
]

@Component({
    standalone: true,
    selector: 'app-shop',
    templateUrl: './shop.component.html',
    styleUrl: './shop.component.scss',
    imports: [
        ...NB_LIBS,
        CommonModule,
        ShopListComponent
    ],
    providers: [

    ]
})

export class ShopComponent implements OnInit {

    constructor(
        private router: Router
    ) { }

    ngOnInit(): void {

    }

    onCreate() {
        this.router.navigate(['/shop/list/create']);
    }
}