import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbButtonModule, NbDialogModule, NbDialogService, NbIconModule, NbInputModule, NbSelectModule, NbTooltipModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { ShopManagement } from '../../../data/management/shop.management';
import { ShopService } from '../../../data/service/shop.service';
import { ImageResource } from '../../../common/resource/image_resource';
import { PagingModel } from '../../../common/model/paging.model';
import { NgxPaginationModule } from 'ngx-pagination';
import { WithdrawalModalComponent } from '../withdrawal-modal/withdrawal-modal.component';
import { ToastNotification } from '../../common/toast/toast.component';
import { Withdrawal } from '../../../data/model/withdrawal/withdrawal.model';

const NB_LIBS = [
    NbTooltipModule,
    NbInputModule,
    NbButtonModule,
    NbSelectModule,
    NbDialogModule,
    NbIconModule
]

const ANGULAR_MODULE = [
    CommonModule,
    TranslateModule,
    NgxPaginationModule
]

const PROVIDERS = [
    ShopManagement,
    ShopService
]

@Component({
    standalone: true,
    selector: 'app-balance-account',
    templateUrl: './balance.component.html',
    styleUrls: ['./balance.component.scss'],
    imports: [...NB_LIBS, ...ANGULAR_MODULE],
    providers: [...PROVIDERS],
})
export class BalanceComponent implements OnInit {
    icon_camera_upload: string = ImageResource.icon_camera_upload;
    image_upload_person: string = ImageResource.image_upload_person;
    image_not_found: string = ImageResource.image_chart_bar;

    balance: number = 0;
    withdrawalHistories: Withdrawal[] = [];

    offset: number = 0;
    paging: PagingModel = new PagingModel();

    constructor(
        private shopMana: ShopManagement,
        private dialogService: NbDialogService
    ) { }

    async ngOnInit() {
        this.paging = new PagingModel();
        await this.fetchBalanceShop();
        await this.fetchWithdrawalHistories();
        this.resetPagination();
    }

    async fetchBalanceShop() {
        try {
            this.balance = await this.shopMana.fetchBalanceShop();
        } catch (error) {
            console.log(error);
        }
    }

    async fetchWithdrawalHistories() {
        try {
            this.withdrawalHistories = await this.shopMana.fetchListWithdrawalHistories();
        } catch (error) {
            console.log(error);
        }
    }

    openWithdrawPopup() {
        this.dialogService.open(WithdrawalModalComponent, {
            closeOnBackdropClick: false,
            context: {
                currBalance: this.balance
            }
        }).onClose.subscribe(response => {
            if (response instanceof Withdrawal) {
                this.withdrawalHistories.unshift(response);
                this.balance = this.balance - response.amount;
                this.resetPagination();
                ToastNotification.success('Rút tiền thành công');
            }
        })
    }

    onPageChange(currentPage: number) {
        this.paging.currentPage = currentPage;
        this.offset = (currentPage - 1) * this.paging.itemsPerPage + 1;
    }


    resetPagination() {
        this.paging.currentPage = 1;
        this.paging.itemsPerPage = 5;
        this.paging.totalItems = this.withdrawalHistories.length;
        this.paging.totalPage = Math.ceil(this.withdrawalHistories.length / this.paging.itemsPerPage);
        this.offset = (this.paging.currentPage - 1) * this.paging.itemsPerPage + 1;
    }

}