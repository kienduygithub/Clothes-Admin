import { NgModule } from "@angular/core";
import { ExtraOptions, RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./common/config/guard.config";

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./screen/screen.module').then(m => m.ScreenModule)
    },
    {
        path: 'auth',
        loadChildren: () => import('./screen/auth/auth.module').then(m => m.AuthModule)
    }
];

export const routing = RouterModule.forRoot(routes);

const config: ExtraOptions = {
    useHash: false
}

@NgModule({
    imports: [RouterModule.forRoot(routes, config)],
    exports: [RouterModule]
})

export class ApplicationRouting { }