import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NbButtonModule, NbInputModule } from "@nebular/theme";
import { CommonModule } from "@angular/common";
import { CouponUrl } from "./coupon.routing";
import { CouponListComponent } from "./comp/coupon-list/coupon-list.component";

const NB_LIBS = [
    NbInputModule,
    NbButtonModule
]

const ANGULAR_MODULES = [
    CommonModule
]

@Component({
    standalone: true,
    selector: 'app-owner-coupon',
    templateUrl: './coupon.component.html',
    styleUrl: './coupon.component.scss',
    imports: [
        ...NB_LIBS,
        ...ANGULAR_MODULES,
        CouponListComponent
    ],
    providers: []
})

export class CouponComponent implements OnInit {

    constructor(
        private router: Router
    ) { }

    ngOnInit() { }

    onCreate() {
        this.router.navigate([CouponUrl.COUPON_VIEW_URL]);
    }
}