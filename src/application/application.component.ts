import { Component, OnInit } from "@angular/core";

@Component({
    selector: 'app-root',
    template: `
        <app-toast-notification></app-toast-notification>
        <router-outlet></router-outlet>
    `
})

export class ApplicationComponent implements OnInit {

    constructor(

    ) { }

    ngOnInit(): void {

    }
}