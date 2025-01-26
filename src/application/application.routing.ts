import { NgModule } from "@angular/core";
import { ExtraOptions, RouterModule, Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./screen/screen.module').then(m => m.ScreenModule)
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