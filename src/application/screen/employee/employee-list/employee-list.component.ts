import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";

@Component({
    standalone: true,
    selector: 'employee-list-component',
    templateUrl: './employee-list.component.html',
    styleUrl: './employee-list.component.scss',
    imports: [
        CommonModule
    ],
    providers: [

    ]
})

export class EmployeeListComponent implements OnInit {

    constructor(

    ) { }

    async ngOnInit() {

    }
}