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
    selector: 'app-owner-overview',
    templateUrl: './owner-overview.component.html',
    styleUrl: './owner-overview.component.scss',
    imports: [
        ...NB_LIBS,
        ...ANGULAR_MODULES
    ],
    providers: []
})

export class OwnerOverviewComponent {

    constructor(

    ) { }
}