import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from "@angular/router";
import { AppConfig } from "./app.config";
import { AuthService } from "../../data/service/auth.service";
import { AuthUrl } from "../../screen/auth/auth.routing";
import { Location } from "@angular/common";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

    constructor(
        private appConfig: AppConfig,
        private router: Router,
        private location: Location,
        private authService: AuthService
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {

        const user = this.appConfig.getUserInfo();
        console.log(state.url)
        if (!user) {
            if (state.url === AuthUrl.SIGNIN) {
                return true;
            }

            this.router.navigate([AuthUrl.SIGNIN]);
            return false;
        }

        const isAdminRoute = state.url.startsWith('/admin');
        const isShopRoute = state.url.startsWith('/shop');
        const isLoginPage = state.url.includes('/auth');

        // Đăng nhập rồi vẫn cố tình vào trang thì quay lại
        if (isLoginPage) {
            this.location.back();
            return false;
        }

        return true;
    }
}