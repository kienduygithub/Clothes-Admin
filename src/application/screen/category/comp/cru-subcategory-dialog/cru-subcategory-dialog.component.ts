import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { CategoryManagement } from "../../../../data/management/category.management";
import { CategoryService } from "../../../../data/service/category.service";
import { NbButtonModule, NbDialogRef, NbDialogService, NbIconModule, NbInputModule, NbSpinnerModule, NbTooltipModule } from "@nebular/theme";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { AppConfig } from "../../../../common/config/app.config";
import { CategoryModel } from "../../../../data/model/category.model";
import { ImageResource } from "../../../../common/resource/image_resource";
import { NgxPaginationModule } from "ngx-pagination";
import { PagingModel } from "../../../../common/model/paging.model";
import { WarningComponent } from "../../../../common/layout/notify/warning/warnimg.component";
import { ErrorModel } from "../../../../common/model/error";
import { HttpCode } from "../../../../common/resource/http-code";
import { CategoryValidate } from "../../../../common/utils/validate/category.validate";

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
    protected subCategories: CategoryModel[] = [];
    protected subCategoryNames: string[] = [];
    protected preImage = "";

    protected addForm!: FormGroup;

    constructor(
        private appConfig: AppConfig,
        private fb: FormBuilder,
        private dialogService: NbDialogService,
        private ref: NbDialogRef<CRUSubcategoryDialogComponent>,
        private categoryManagement: CategoryManagement,
        private cdr: ChangeDetectorRef
    ) { }

    async ngOnInit() {
        this.preImage = this.appConfig.getPreImage() ?? "";
        this.subCategories = this.categoryModel.sub_categories ?? [];
        this.subCategoryNames = this.subCategories.map(category => category.category_name!);
        this.paging = new PagingModel();
        this.resetPagination();
        await this.getCategory();
        this.initForm();
        this.cdr.detectChanges();
    }

    async getCategory() {
        try {
            this.categoryModel = await this.categoryManagement.fetchCategoryByParentId(this.categoryModel.id!);
        } catch (error) {
            throw error;
        }
    }

    initForm() {
        this.addForm = this.fb.group({
            category_name: ['', [CategoryValidate.uniqueSubCategory(this.subCategoryNames)]],
        });
    }

    async onAddSubCategory() {
        console.log(this.addForm.value);
        if (this.addForm.invalid) {
            console.log('INVALID FORM');
            return;
        }

        if (this.addForm.getRawValue().category_name.trim() === '') {
            return;
        }

        try {
            const model = new CategoryModel();
            model.category_name = this.addForm.getRawValue().category_name;
            model.parentId = this.categoryModel.id;
            const response = await this.categoryManagement.addNewSubCategory(model);
            this.subCategories.unshift(response);
            this.subCategoryNames.unshift(model.category_name!);
            this.addForm.setValue({
                category_name: ''
            });
            this.resetPagination();
            this.cdr.detectChanges();
        } catch (error) {
            console.log(error);
            if (error instanceof ErrorModel) {
                if (error.code === HttpCode.BAD_REQUEST) {
                    if (error.message.includes('Tên thư mục con đã tồn tại')) {
                        this.addForm.get('category_name')?.setErrors({ conflictName: true });
                    }
                }
            }
        }
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
            await this.categoryManagement.deleteSubCategory(this.categoryModel.id!, categoryId);
            this.subCategoryNames.splice(index, 1);
            this.subCategories.splice(index, 1);
            this.paging.totalItems = this.subCategories.length;
            this.paging.totalPage = Math.ceil(this.subCategories.length / this.paging.itemsPerPage);
            if (this.paging.currentPage === this.paging.totalPage + 1) {
                this.onPageChange(this.paging.currentPage - 1);
            }
            this.cdr.detectChanges();
        } catch (error) {
            console.log(error);
        }
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
        this.paging.totalItems = this.subCategories.length;
        this.paging.totalPage = Math.ceil(this.subCategories.length / 3);
        this.paging.before = 0;
        this.paging.after = 0;

        this.offset = (this.paging.currentPage - 1) * this.paging.itemsPerPage + 1;
    }
}