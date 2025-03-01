import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { PagingModel } from "../../../common/model/paging.model";
import { Router } from "@angular/router";
import { AppConfig } from "../../../common/config/app.config";
import { NbButtonModule, NbDialogService, NbIconModule, NbInputModule, NbTooltipModule } from "@nebular/theme";
import { ImageResource } from "../../../common/resource/image_resource";
import { UserModel } from "../../../data/model/user/user.model";
import { UserManagement } from "../../../data/management/user.management";
import { UserService } from "../../../data/service/user.service";
import { NgxPaginationModule } from "ngx-pagination";
import { WarningComponent } from "../../../common/layout/notify/warning/warnimg.component";

const NB_LIBS = [
    NbInputModule,
    NbButtonModule,
    NbIconModule,
    NbTooltipModule
]

const ANGULAR_LIBS = [
    NgxPaginationModule
]

@Component({
    standalone: true,
    selector: 'employee-list-component',
    templateUrl: './employee-list.component.html',
    styleUrl: './employee-list.component.scss',
    imports: [
        ...NB_LIBS,
        ...ANGULAR_LIBS,
        CommonModule
    ],
    providers: [
        UserManagement,
        UserService
    ]
})

export class EmployeeListComponent implements OnInit {

    icon_filter: string = ImageResource.icon_filter;
    icon_refresh: string = ImageResource.icon_refresh;
    image_not_found: string = ImageResource.image_not_found;

    offset: number = 0;
    paging!: PagingModel;

    preImage: string = '';
    allUsers: UserModel[] = [];

    constructor(
        private router: Router,
        private appConfig: AppConfig,
        private dialogService: NbDialogService,
        private userManagement: UserManagement
    ) { }

    async ngOnInit() {
        this.preImage = this.appConfig.getPreImage() ?? "";
        this.paging = new PagingModel();
        await this.fetchAllUsers();
        this.resetPagination();
    }

    async fetchAllUsers() {
        try {
            this.allUsers = await this.userManagement.fetchAllUser("Chưa biết");
        } catch (error) {
            console.log(error);
        }
    }

    onUpdateUser(id: number) {
        this.router.navigate(['/employee/list/view'], { queryParams: { id: id } });
    }

    onConfirmDeleteUser(user: UserModel) {
        this.dialogService.open(WarningComponent, {
            context: {
                title: 'Xóa',
                content: 'Bạn có chắc muốn xóa nhân sự ' + user.name + '?',
                acceptFunc: this.handleDeleteUser.bind(this, user.id!)
            }
        })
    }

    async handleDeleteUser(userId: number) {
        try {
            await this.userManagement.deleteUserById(userId);
            this.allUsers = this.allUsers.filter(user => user.id !== userId);
            this.paging.totalItems = this.allUsers.length;
            this.paging.totalPage = Math.ceil(this.allUsers.length / this.paging.itemsPerPage);
            if (this.paging.currentPage === this.paging.totalPage + 1) {
                this.onPageChange(this.paging.currentPage - 1);
            }
        } catch (error) {
            console.log(error);
        }
    }

    onPageChange(currentPage: number) {
        this.paging.currentPage = currentPage;
        this.offset = (currentPage - 1) * this.paging.itemsPerPage + 1;
        if (currentPage === 1) {
            this.paging.before = currentPage;
            this.paging.after = currentPage + 1;
        } else if (currentPage === this.paging.totalPage) {
            this.paging.before = currentPage - 1;
            this.paging.after = currentPage;
        } else if (currentPage > 1 || currentPage < this.paging.totalPage) {
            this.paging.before = currentPage - 1;
            this.paging.after = currentPage + 1;
        }
    }

    resetPagination() {
        this.paging.currentPage = 1;
        this.paging.itemsPerPage = 10;
        this.paging.totalItems = this.allUsers.length;
        this.paging.totalPage = Math.ceil(this.allUsers.length / 3);
        this.paging.before = 0;
        this.paging.after = 0;

        this.offset = (this.paging.currentPage - 1) * this.paging.itemsPerPage + 1;
    }
}