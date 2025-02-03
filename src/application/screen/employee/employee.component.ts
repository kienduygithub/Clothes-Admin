import { Component } from "@angular/core";
import { EmployeeListComponent } from "./employee-list/employee-list.component";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { NbButtonModule } from "@nebular/theme";

const NB_LIBS = [
    NbButtonModule,
]

@Component({
    standalone: true,
    selector: 'employee-component',
    templateUrl: './employee.component.html',
    styleUrl: './employee.component.scss',
    imports: [
        ...NB_LIBS,
        CommonModule,
        EmployeeListComponent,
    ],
    providers: [

    ]
})

export class EmployeeComponent {

    constructor(
        private router: Router
    ) { }

    onCreate() {
        this.router.navigate(['/employee/list/create']);
    }
}