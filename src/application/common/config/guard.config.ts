import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from "@angular/router";
import { AppConfig } from "./app.config";
import { AuthService } from "../../data/service/auth.service";
import { AuthUrl } from "../../screen/auth/auth.routing";
import { Location } from "@angular/common";
import { Roles } from "../resource/roles";

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

        if (!user) {
            switch (state.url) {
                case AuthUrl.SIGNIN:
                case AuthUrl.SIGNUP:
                    return true;
            }

            this.router.navigate([AuthUrl.SIGNIN]);
            return false;
        }

        const isAdminRoute = state.url.startsWith('/admin');
        const isOwnerRoute = state.url.startsWith('/owner');
        const isLoginPage = state.url.includes('/auth');

        // Đăng nhập rồi vẫn cố tình vào trang thì quay lại
        if (isLoginPage) {
            user.roles === Roles.ADMIN
                ? this.router.navigate(['/admin'])
                : this.router.navigate(['/owner']);
            return false;
        }

        if (isAdminRoute && user.roles !== Roles.ADMIN) {
            this.router.navigate(['/owner']);
            return false;
        }

        if (isOwnerRoute && user.roles !== Roles.OWNER) {
            this.router.navigate(['/admin']);
            return false;
        }

        if (state.url === '/') {
            user.roles === Roles.ADMIN
                ? this.router.navigate(['/admin'])
                : this.router.navigate(['/owner']);
            return false;
        }

        return true;
    }
}