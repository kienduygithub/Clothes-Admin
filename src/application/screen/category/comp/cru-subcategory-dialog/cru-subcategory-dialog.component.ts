import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { CategoryManagement } from "../../../../data/management/category.management";
import { CategoryService } from "../../../../data/service/category.service";
import { NbButtonModule, NbDialogRef, NbDialogService, NbIconModule, NbInputModule, NbSpinnerModule, NbTooltipModule } from "@nebular/theme";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { AppConfig } from "../../../../common/config/app.config";
import { CategoryModel } from "../../../../data/model/category.model";
import { ImageResource } from "../../../../common/resource/image_resource";
import { NgxPaginationModule } from "ngx-pagination";
import { PagingModel } from "../../../../common/model/paging.model";

const NB_LIBS = [
    NbInputModule,
    NbButtonModule,
    NbSpinnerModule,
    NbIconModule,
    NbTooltipModule
]

@Component({
    standalone: true,
    selector: 'cru-subcategory-dialog-component',
    templateUrl: './cru-subcategory-dialog.component.html',
    styleUrl: './cru-subcategory-dialog.component.scss',
    imports: [
        ...NB_LIBS,
        CommonModule,
        ReactiveFormsModule,
        NgxPaginationModule
    ],
    providers: [
        CategoryManagement,
        CategoryService
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class CRUSubcategoryDialogComponent implements OnInit {
    protected loading = false;
    protected icon_delete = ImageResource.delete_button;
    protected icon_upload_v3 = ImageResource.icon_upload_v3;
    protected icon_category = ImageResource.icon_category;
    protected icon_close_dialog = ImageResource.icon_close_dialog;

    offset: number = 0;
    paging!: PagingModel;

    categoryModel!: CategoryModel;
    protected preImage = "";

    constructor(
        private appConfig: AppConfig,
        private fb: FormBuilder,
        private dialogService: NbDialogService,
        private ref: NbDialogRef<CRUSubcategoryDialogComponent>,
        private categoryManagement: CategoryManagement,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        console.log(this.categoryModel)
        this.preImage = this.appConfig.getPreImage() ?? "";
        this.paging = new PagingModel();
        this.resetPagination();
    }

    onCancel() {
        this.ref.close(false);
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
        this.paging.itemsPerPage = 5;
        this.paging.totalItems = this.categoryModel.sub_categories!.length;
        this.paging.totalPage = Math.ceil(this.categoryModel.sub_categories!.length / 3);
        this.paging.before = 0;
        this.paging.after = 0;

        this.offset = (this.paging.currentPage - 1) * this.paging.itemsPerPage + 1;
    }
}