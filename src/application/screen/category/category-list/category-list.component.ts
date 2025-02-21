import { CommonModule } from "@angular/common";
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { CategoryManagement } from "../../../data/management/category.management";
import { CategoryService } from "../../../data/service/category.service";
import { Router } from "@angular/router";
import { NbButtonModule, NbDialogService, NbIconModule, NbInputModule, NbTooltipModule } from "@nebular/theme";
import { NgxPaginationModule } from "ngx-pagination";
import { ImageResource } from "../../../common/resource/image_resource";
import { PagingModel } from "../../../common/model/paging.model";
import { CategoryModel } from "../../../data/model/category.model";
import { AppConfig } from "../../../common/config/app.config";
import { CategoryUrl } from "../category.routing";
import { WarningComponent } from "../../../common/layout/notify/warning/warnimg.component";
import { CRUCategoryDialogComponent } from "../comp/cru-category-dialog/cru-category-dialog.component";
import { actions } from "../../../common/resource/actions";
import { CRUSubcategoryDialogComponent } from "../comp/cru-subcategory-dialog/cru-subcategory-dialog.component";

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
    selector: 'category-list-component',
    templateUrl: './category-list.component.html',
    styleUrl: './category-list.component.scss',
    imports: [
        ...NB_LIBS,
        ...ANGULAR_LIBS,
        CommonModule,
    ],
    providers: [
        CategoryManagement,
        CategoryService
    ]
})

export class CategoryListComponent implements OnInit {

    icon_filter: string = ImageResource.icon_filter;
    icon_refresh: string = ImageResource.icon_refresh;
    icon_folder_open: string = ImageResource.icon_folder_open;
    image_not_found: string = ImageResource.image_not_found;

    offset: number = 0;
    paging!: PagingModel;

    preImage: string = '';
    categories: CategoryModel[] = [];

    constructor(
        private router: Router,
        private appConfig: AppConfig,
        private dialogService: NbDialogService,
        private categoryManagement: CategoryManagement,
        private cdr: ChangeDetectorRef
    ) { }

    async ngOnInit() {
        this.preImage = this.appConfig.getPreImage() ?? "";
        this.paging = new PagingModel();
        await this.fetchCategories();
        this.dialogService.open(CRUSubcategoryDialogComponent, {
            context: {
                categoryModel: this.categories[0]
            }
        })
        this.resetPagination();
    }

    onCreate() {
        this.dialogService.open(CRUCategoryDialogComponent, {
            context: {
                action: actions.CREATE,
                categoryModel: new CategoryModel(),
            }
        }).onClose.subscribe((response) => {
            if (response === true) {
                return;
            }

            if (response instanceof CategoryModel) {
                this.categories.unshift(response);
                this.cdr.detectChanges();
            }
        })
    }

    async fetchCategories() {
        try {
            this.categories = await this.categoryManagement.fetchCategories();
            this.cdr.markForCheck();
        } catch (error) {
            console.log(error);
        }
    }

    onUpdateCategory(category: CategoryModel, index: number) {
        this.dialogService.open(CRUCategoryDialogComponent, {
            context: {
                action: actions.UPDATE,
                categoryModel: category,
            }
        }).onClose.subscribe(response => {
            if (response === true) {
                return;
            }

            if (response instanceof CategoryModel) {
                this.categories.splice(index, 1, response);
                this.cdr.detectChanges();
            }
        })
    }

    onConfirmDeleteCategory(category: CategoryModel, index: number) {
        this.dialogService.open(WarningComponent, {
            context: {
                title: 'Xóa',
                content: 'Bạn có chắc muốn xóa danh mục ' + category.category_name + '?',
            }
        }).onClose.subscribe(async (response) => {
            if (response === true) {
                await this.handleDeleteCategory(category.id!, index);
            }
        })
    }

    async handleDeleteCategory(categoryId: number, index: number) {
        try {
            await this.categoryManagement.deleteCategory(categoryId);
            this.categories.splice(index, 1);
            this.paging.totalItems = this.categories.length;
            this.paging.totalPage = Math.ceil(this.categories.length / this.paging.itemsPerPage);
            if (this.paging.currentPage === this.paging.totalPage + 1) {
                this.onPageChange(this.paging.currentPage - 1);
            }
            this.cdr.detectChanges();
        } catch (error) {
            console.log(error);
        }
    }

    onOpenViewChildList(parentCategory: CategoryModel) {
        console.log(parentCategory);
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
        this.paging.totalItems = this.categories.length;
        this.paging.totalPage = Math.ceil(this.categories.length / 3);
        this.paging.before = 0;
        this.paging.after = 0;

        this.offset = (this.paging.currentPage - 1) * this.paging.itemsPerPage + 1;
    }
}