import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NbButtonModule, NbInputModule } from "@nebular/theme";
import { CommonModule } from "@angular/common";
import { ListOrderComponent } from "./list-order/list-order.component";

const NB_LIBS = [
    NbInputModule,
    NbButtonModule
]

const ANGULAR_MODULES = [
    CommonModule,
    ListOrderComponent
]

@Component({
    standalone: true,
    selector: 'app-owner-order',
    templateUrl: './order.component.html',
    styleUrl: './order.component.scss',
    imports: [
        ...NB_LIBS,
        ...ANGULAR_MODULES,
    ],
    providers: []
})

export class OrderComponent implements OnInit {

    constructor(
        private router: Router
    ) { }

    ngOnInit() { }
}