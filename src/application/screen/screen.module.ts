import { NgModule } from "@angular/core";
import { NbMenuModule } from "@nebular/theme";
import { NbEvaIconsModule } from "@nebular/eva-icons";
import { ScreenComponent } from "./screen.component";
import { ReactiveFormsModule } from "@angular/forms";
import { BaseLayoutComponent } from "../common/layout/base/base.layout";
import { ScreenRouting } from "./screen.routing";
const NB_LIB = [
    NbMenuModule,
    NbEvaIconsModule
];

@NgModule({
    declarations: [ScreenComponent],
    imports: [
        ...NB_LIB,
        ReactiveFormsModule,
        ScreenRouting,
        BaseLayoutComponent,
    ],
})

export class ScreenModule { }