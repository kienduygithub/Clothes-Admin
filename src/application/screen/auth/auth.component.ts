import { Component } from "@angular/core";

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
})

export class AuthComponent {

    constructor(

    ) { }
}