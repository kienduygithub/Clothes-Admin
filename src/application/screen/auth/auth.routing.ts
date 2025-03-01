import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthComponent } from "./auth.component";
import { SignInComponent } from "./sign-in/sign-in.component";
import { AuthGuard } from "../../common/config/guard.config";
import { SignUpComponent } from "./sign-up/sign-up.component";

export const AuthUrl = {
    SIGNIN: '/auth/sign-in',
    SIGNUP: '/auth/sign-up'
};

const AuthRoutes: Routes = [
    {
        path: 'auth',
        canActivate: [AuthGuard],
        component: AuthComponent,
        children: [
            {
                path: '',
                redirectTo: 'sign-in',
                pathMatch: 'full'
            },
            {
                path: 'sign-in',
                title: 'Đăng nhập',
                component: SignInComponent
            },
            {
                path: 'sign-up',
                title: 'Đăng ký',
                component: SignUpComponent
            },
            {
                path: '**',
                redirectTo: 'sign-in'
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(AuthRoutes)],
    exports: [RouterModule]
})

export class AuthRouting { }