import { Routes } from "@angular/router";
import { CRUEmployeeComponent } from "./comp/cru-employee/cru-employee.component";

export const EmployeeUrl = {
    EMPLOYEE_LIST: 'admin/employee/list',
    CREATE_EMPLOYEE: 'admin/employee/create',
    VIEW_EMPLOYEE: 'admin/employee/view'
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