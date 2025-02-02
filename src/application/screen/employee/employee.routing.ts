import { Routes } from "@angular/router";
import { CRUEmployeeComponent } from "./comp/cru-employee/cru-employee.component";

export const EmployeeRouting: Routes = [
    {
        path: 'employee/list/create',
        component: CRUEmployeeComponent,
    }
]