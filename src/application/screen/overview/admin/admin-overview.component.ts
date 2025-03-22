import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { NbButtonModule, NbIconModule, NbInputModule, NbTooltipModule } from "@nebular/theme";

const NB_LIBS = [
    NbIconModule,
    NbInputModule,
    NbButtonModule,
    NbTooltipModule,
]

const ANGULAR_MODULES = [
    CommonModule,
]

@Component({
    standalone: true,
    selector: 'app-admin-overview',
    templateUrl: './admin-overview.component.html',
    styleUrl: './admin-overview.component.scss',
    imports: [
        ...NB_LIBS,
        ...ANGULAR_MODULES
    ],
    providers: []
})

export class AdminOverviewComponent {

    constructor(

    ) { }
}