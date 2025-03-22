import { NgModule } from "@angular/core";
import { NbMenuModule } from "@nebular/theme";
import { NbEvaIconsModule } from "@nebular/eva-icons";
import { ScreenComponent } from "./screen.component";
import { ReactiveFormsModule } from "@angular/forms";
import { BaseLayoutComponent } from "../common/layout/base/base.layout";
import { ScreenRouting } from "./screen.routing";
import { AuthInterceptor } from "../common/utils/auth.interceptor";
import { HTTP_INTERCEPTORS } from "@angular/common/http";

const NB_LIB = [
    NbMenuModule,
    NbEvaIconsModule
];

const ANGULAR_LIB = [ReactiveFormsModule];

@NgModule({
    declarations: [ScreenComponent],
    imports: [
        ...NB_LIB,
        ...ANGULAR_LIB,
        ScreenRouting,
        BaseLayoutComponent,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    ]
})

export class ScreenModule { }