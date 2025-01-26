import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ScreenComponent } from './screen.component';

const routes: Routes = [
    {
        path: '',
        component: ScreenComponent,
        children: [

        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ScreenRouting { }
