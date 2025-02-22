import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AuthComponent } from "./auth.component";
import { AuthRouting } from "./auth.routing";
import { SignInComponent } from "./sign-in/sign-in.component";
import { NbButtonModule, NbInputModule } from "@nebular/theme";

const NB_LIBS = [
    NbButtonModule,
    NbInputModule,
]

@NgModule({
    declarations: [
        AuthComponent,
        SignInComponent
    ],
    imports: [
        ...NB_LIBS,
        CommonModule,
        AuthRouting
    ],
    providers: []
})

export class AuthModule {

    constructor(

    ) { }
}