import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { CategoryManagement } from "../../../../data/management/category.management";
import { CategoryService } from "../../../../data/service/category.service";
import { NbButtonModule, NbDialogRef, NbDialogService, NbIconModule, NbInputModule, NbSpinnerModule, NbTooltipModule } from "@nebular/theme";
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { AppConfig } from "../../../../common/config/app.config";
import { CategoryModel } from "../../../../data/model/category.model";
import { ImageResource } from "../../../../common/resource/image_resource";
import { NgxPaginationModule } from "ngx-pagination";
import { PagingModel } from "../../../../common/model/paging.model";
import { WarningComponent } from "../../../../common/layout/notify/warning/warnimg.component";
import { ErrorModel } from "../../../../common/model/error";
import { HttpCode } from "../../../../common/resource/http-code";
import { CategoryValidate } from "../../../../common/utils/validate/category.validate";
import { ValueValidators } from "../../../../common/utils/validate/value.validate";

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
    protected icon_cancel = ImageResource.icon_cancel;
    protected icon_accept_tick = ImageResource.icon_accept_tick;
    protected icon_edit = ImageResource.icon_edit;

    offset: number = 0;
    paging!: PagingModel;

    categoryModel!: CategoryModel;
    protected subCategories: CategoryModel[] = [];
    protected subCategoryNames = new Map<number, string>();
    protected preImage = "";

    protected addForm!: FormGroup;
    protected subCategoryForm!: FormGroup;

    constructor(
        private appConfig: AppConfig,
        private fb: FormBuilder,
        private dialogService: NbDialogService,
        private ref: NbDialogRef<CRUSubcategoryDialogComponent>,
        private categoryManagement: CategoryManagement,
        private cdr: ChangeDetectorRef
    ) { }

    async ngOnInit() {
        this.loading = true;
        this.preImage = this.appConfig.getPreImage() ?? "";
        this.paging = new PagingModel();
        await this.getCategory();
        this.initForm();
        this.resetPagination();
        this.loading = false;
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
        this.subCategories = this.categoryModel.sub_categories ?? [];

        this.subCategoryNames = new Map(
            this.subCategories.map(category => [category.id!, category.category_name!])
        );

        this.addForm = this.fb.group({
            category_name: ['', [CategoryValidate.uniqueSubCategory(this.subCategoryNames)]],
        });

        this.subCategoryForm = this.fb.group({
            subCategories: this.fb.array(
                this.subCategories.map((subcategory) => this.fb.group(
                    {
                        id: subcategory.id,
                        category_name: [subcategory.category_name, [ValueValidators.required]],
                        editMode: [false],
                        origin_name: [subcategory.category_name]
                    }, { validators: [CategoryValidate.uniqueSubCategoryOnTable(this.subCategoryNames)] })
                )
            )
        });

        this.cdr.detectChanges();
    }

    get subCategoriesArray() {
        return this.subCategoryForm.get('subCategories') as FormArray;
    }

    get subCategoryControls(): FormGroup[] {
        return this.subCategoriesArray.controls as FormGroup[];
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
            this.loading = true;
            const model = new CategoryModel();
            model.category_name = this.addForm.getRawValue().category_name;
            model.parentId = this.categoryModel.id;
            const response = await this.categoryManagement.addNewSubCategory(model);
            this.subCategoryNames.set(response.id!, response.category_name!);
            this.subCategoryControls.unshift(
                this.fb.group({
                    id: response.id,
                    category_name: [response.category_name, [ValueValidators.required]],
                    editMode: false,
                    origin_name: [response.category_name]
                }, { validators: [CategoryValidate.uniqueSubCategoryOnTable(this.subCategoryNames)] })
            );
            this.addForm.setValue({
                category_name: ''
            });
            this.resetPagination();
        } catch (error) {
            console.log(error);
            if (error instanceof ErrorModel) {
                if (error.code === HttpCode.BAD_REQUEST) {
                    if (error.message.includes('Tên thư mục con đã tồn tại')) {
                        this.addForm.get('category_name')?.setErrors({ conflictName: true });
                    }
                }
            }
        } finally {
            this.loading = false;
            this.cdr.detectChanges();
        }
    }

    async onEnterToAddSubcategory() {
        await this.onAddSubCategory();
    }

    onEditSubcategory(index: number) {
        const control = this.subCategoryControls.at(index) as FormGroup;
        control.patchValue({
            editMode: true
        });

        this.cdr.detectChanges();
    }

    async onSaveEditSubcategory(index: number) {
        try {
            this.loading = true;
            const control = this.subCategoryControls.at(index) as FormGroup;
            const idValue = control.get('id')?.value;
            const categoryNameControl = control.get('category_name') as FormControl;

            if (control.invalid || (categoryNameControl && categoryNameControl.invalid)) {
                return;
            }
            const categoryInfo = new CategoryModel();
            categoryInfo.id = idValue;
            categoryInfo.category_name = control.getRawValue().category_name;
            categoryInfo.parentId = this.categoryModel.id;

            const response = await this.categoryManagement.updateSubCategory(categoryInfo);
            this.subCategoryNames.set(idValue, response?.category_name!);
            control.patchValue({
                editMode: false,
                origin_name: response?.category_name!
            });
            this.addForm.get('category_name')?.updateValueAndValidity();
        } catch (error) {
            console.log(error);
        } finally {
            this.loading = false;
        }
        this.cdr.detectChanges();
    }

    onCancelEditSubcategory(index: number) {
        const control = this.subCategoryControls.at(index) as FormGroup;
        control.patchValue({
            editMode: false,
            category_name: control.get('origin_name')?.value
        });

        this.cdr.detectChanges();
    }

    onConfirmDeleteCategory(index: number) {
        const indexOnTable = (this.paging.currentPage - 1) * this.paging.itemsPerPage + index;
        const subCategory = { ...this.subCategoriesArray.at(indexOnTable).value } as CategoryModel;
        this.dialogService.open(WarningComponent, {
            context: {
                title: 'Xóa',
                content: 'Bạn có chắc muốn xóa danh mục ' + subCategory.category_name + '?',
            }
        }).onClose.subscribe(async (response) => {
            if (response === true) {
                await this.handleDeleteCategory(subCategory.id!, indexOnTable);
            }
        })
    }

    async handleDeleteCategory(categoryId: number, index: number) {
        try {
            this.loading = true;
            await this.categoryManagement.deleteSubCategory(this.categoryModel.id!, categoryId);
            this.subCategoryNames.delete(categoryId);
            this.subCategoryControls.splice(index, 1);
            this.paging.totalItems = this.subCategoryControls.length;
            this.paging.totalPage = Math.ceil(this.subCategoryControls.length / this.paging.itemsPerPage);
            if (this.paging.currentPage === this.paging.totalPage + 1) {
                this.onPageChange(this.paging.currentPage - 1);
            }
        } catch (error) {
            console.log(error);
        } finally {
            this.loading = false;
            this.addForm.get('category_name')?.updateValueAndValidity();
        }
        this.cdr.detectChanges();
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
        this.paging.totalItems = this.subCategoryControls.length;
        this.paging.totalPage = Math.ceil(this.subCategoryControls.length / 3);
        this.paging.before = 0;
        this.paging.after = 0;

        this.offset = (this.paging.currentPage - 1) * this.paging.itemsPerPage + 1;
    }
}