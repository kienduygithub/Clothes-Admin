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
    selector: 'app-admin-stats',
    templateUrl: './admin-stats.component.html',
    styleUrl: './admin-stats.component.scss',
    imports: [
        ...NB_LIBS,
        ...ANGULAR_MODULES
    ],
    providers: []
})

export class AdminStatsComponent {

    constructor(

    ) { }
}