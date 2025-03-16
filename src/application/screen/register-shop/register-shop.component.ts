import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NbButtonModule, NbInputModule } from "@nebular/theme";
import { CommonModule } from "@angular/common";
import { RegisterShopListComponent } from "./comp/register-shop-list/register-shop-list.component";

const NB_LIBS = [
    NbInputModule,
    NbButtonModule
]

@Component({
    standalone: true,
    selector: 'app-register-shop',
    templateUrl: './register-shop.component.html',
    styleUrl: './register-shop.component.scss',
    imports: [
        ...NB_LIBS,
        CommonModule,
        RegisterShopListComponent
    ],
    providers: [

    ]
})

export class RegisterShopComponent implements OnInit {

    constructor(
        private router: Router
    ) { }

    ngOnInit(): void {

    }

    onCreate() {

    }
}