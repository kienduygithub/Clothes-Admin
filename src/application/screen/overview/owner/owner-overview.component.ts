import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NbButtonModule, NbIconModule, NbInputModule, NbTooltipModule } from "@nebular/theme";
import { OverviewManagement } from "../../../data/management/overview.management";
import { OverviewService } from "../../../data/service/overview.service";
import { OverviewStatsModel } from "../../../data/model/overview/overview.model";

const NB_LIBS = [
    NbIconModule,
    NbInputModule,
    NbButtonModule,
    NbTooltipModule,
]

const ANGULAR_MODULES = [
    CommonModule,
]

const PROVIDERS = [
    OverviewManagement,
    OverviewService
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
    providers: [...PROVIDERS]
})

export class OwnerOverviewComponent implements OnInit {
    overviewStats!: OverviewStatsModel;
    today = new Date();
    past14Days = new Date();

    constructor(
        private overviewMana: OverviewManagement
    ) { }

    async ngOnInit(): Promise<any> {
        this.past14Days.setDate(this.today.getDate() - 14)
        await this.fetchShopOverviewStats();
    }

    async fetchShopOverviewStats() {
        try {
            const response = await this.overviewMana.fetchShopOverviewStats(this.past14Days, this.today);
            this.overviewStats = response;
        } catch (error) {
            console.log(error);
        }
    }
}