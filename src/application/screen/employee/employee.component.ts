import { Component } from "@angular/core";
import { EmployeeListComponent } from "./employee-list/employee-list.component";
import { CommonModule } from "@angular/common";

@Component({
    standalone: true,
    selector: 'employee-component',
    templateUrl: './employee.component.html',
    styleUrl: './employee.component.scss',
    imports: [
        CommonModule,
        EmployeeListComponent,
    ],
    providers: [

    ]
})

export class EmployeeComponent {

    constructor(

    ) { }

}