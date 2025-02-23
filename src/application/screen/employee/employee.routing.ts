import { Routes } from "@angular/router";
import { CRUEmployeeComponent } from "./comp/cru-employee/cru-employee.component";

export const EmployeeUrl = {
    EMPLOYEE_LIST: 'employee/list',
    CREATE_EMPLOYEE: 'employee/list/create',
    VIEW_EMPLOYEE: 'employee/list/view'
}

export const EmployeeRouting: Routes = [
    {
        path: EmployeeUrl.CREATE_EMPLOYEE,
        component: CRUEmployeeComponent,
    },
    {
        path: EmployeeUrl.VIEW_EMPLOYEE,
        component: CRUEmployeeComponent,
    },
]