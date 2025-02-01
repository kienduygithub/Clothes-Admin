import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    standalone: true,
    selector: 'cru-employee-component',
    templateUrl: './cru-employee.component.html',
    styleUrl: './cru-employee.component.scss',
    imports: [
        CommonModule
    ],
    providers: [

    ]
})

export class CRUEmployeeComponent implements OnInit {

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    async ngOnInit() {

    }
}