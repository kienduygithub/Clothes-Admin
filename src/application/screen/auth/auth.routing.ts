import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthComponent } from "./auth.component";
import { SignInComponent } from "./sign-in/sign-in.component";

const AuthRoutes: Routes = [
    {
        path: 'auth',
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
            }
        ]
    },
    // {
    //     path: 'auth/sign-in',
    //     title: 'Đăng nhập hệ thống',
    //     component: SignInComponent
    // }
];

@NgModule({
    imports: [RouterModule.forChild(AuthRoutes)],
    exports: [RouterModule]
})

export class AuthRouting { }