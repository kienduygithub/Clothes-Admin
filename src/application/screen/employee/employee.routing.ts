import { Routes } from "@angular/router";
import { CRUEmployeeComponent } from "./comp/cru-employee/cru-employee.component";

export const EmployeeUrl = {
    EMPLOYEE_LIST: 'admin/employee/list',
    CREATE_EMPLOYEE: 'admin/employee/list/create',
    VIEW_EMPLOYEE: 'admin/employee/list/view'
}

export const EmployeeRouting: Routes = [
    {
        path: EmployeeUrl.CREATE_EMPLOYEE,
        component: CRUEmployeeComponent,
        pathMatch: 'prefix'
    },
    {
        path: EmployeeUrl.VIEW_EMPLOYEE,
        component: CRUEmployeeComponent,
        pathMatch: 'prefix'
    },
]