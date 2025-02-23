import { Component } from "@angular/core";
import { AuthService } from "../../data/service/auth.service";
import { AuthManagement } from "../../data/management/auth.management";

@Component({
    standalone: false,
    selector: 'app-auth',
    template: `
        <router-outlet></router-outlet>
    `,
    styles: [`
        :host{
            width: 100vw;
            height: 100vh;
        }    
    `],
    providers: [
        AuthManagement,
        AuthService
    ]
})

export class AuthComponent {

    constructor(

    ) { }
}