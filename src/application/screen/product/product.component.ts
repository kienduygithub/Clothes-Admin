import { Component, OnInit } from "@angular/core";
import { ProductListComponent } from "./product-list/product-list.component";
import { NbButtonModule, NbInputModule } from "@nebular/theme";
import { Router } from "@angular/router";
import { ProductUrl } from "./product.routing";

const NB_LIBS = [
    NbInputModule,
    NbButtonModule
]

@Component({
    selector: 'app-product',
    standalone: true,
    imports: [
        ...NB_LIBS,
        ProductListComponent,
    ],
    providers: [

    ],
    templateUrl: './product.component.html',
    styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {

    constructor(
        private router: Router
    ) { }

    ngOnInit(): void {

    }

    onCreate() {
        this.router.navigate([ProductUrl.PRODUCT_CREATE]);
    }
}