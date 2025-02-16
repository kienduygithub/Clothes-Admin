import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CategoryManagement } from "../../../../data/management/category.management";
import { CategoryService } from "../../../../data/service/category.service";
import { AppConfig } from "../../../../common/config/app.config";
import { NbButtonModule, NbDialogRef, NbDialogService, NbInputModule, NbSpinnerModule } from "@nebular/theme";
import { CategoryModel } from "../../../../data/model/category.model";
import { actions } from "../../../../common/resource/actions";
import { ValueValidators } from "../../../../common/utils/validate/value.validate";
import { ErrorModel } from "../../../../common/model/error";
import { HttpCode } from "../../../../common/resource/http-code";
import { ErrorComponent } from "../../../../common/layout/notify/error/error.component";
import { ImageResource } from "../../../../common/resource/image_resource";

const NB_LIBS = [
    NbInputModule,
    NbButtonModule,
    NbSpinnerModule,
]

@Component({
    standalone: true,
    selector: 'cru-category-dialog-component',
    templateUrl: './cru-category-dialog.component.html',
    styleUrl: './cru-category-dialog.component.scss',
    imports: [
        ...NB_LIBS,
        CommonModule,
        ReactiveFormsModule
    ],
    providers: [
        CategoryManagement,
        CategoryService
    ]
})

export class CRUCategoryDialogComponent implements OnInit {
    protected loading = false;
    protected icon_delete = ImageResource.delete_button;
    protected icon_upload_v3 = ImageResource.icon_upload_v3;
    protected icon_category = ImageResource.icon_category;
    protected icon_close_dialog = ImageResource.icon_close_dialog;

    protected actions = actions;
    action = this.actions.CREATE;
    categoryModel!: CategoryModel;

    protected preImage = "";
    protected isSubmit = false;
    protected selectedFile!: File;
    protected cruForm!: FormGroup;

    constructor(
        private appConfig: AppConfig,
        private fb: FormBuilder,
        private dialogService: NbDialogService,
        protected ref: NbDialogRef<CRUCategoryDialogComponent>,
        private categoryManagement: CategoryManagement
    ) { }

    async ngOnInit() {
        this.loading = true;
        this.preImage = this.appConfig.getPreImage() ?? "";
        this.initForm();
        this.loading = false;
    }

    protected initForm() {
        if (!this.categoryModel) {
            this.categoryModel = new CategoryModel();
        }
        this.cruForm = this.fb.group({
            category_name: [this.categoryModel.category_name ?? '', [ValueValidators.required]],
            image_url: [this.categoryModel.image_url ?? '', [ValueValidators.required]],
            description: [this.categoryModel.description ?? '']
        });
    }

    onChangeLogoFile(files: any) {
        if (files && files.length > 0) {
            this.selectedFile = files[0];
            this.cruForm.patchValue({
                image_url: URL.createObjectURL(files[0])
            }, { emitEvent: false });
        }
    }

    protected onCancel() {
        this.ref.close(true);
    }

    protected async onSave() {
        if (this.action === actions.CREATE) {
            await this.handleCreate();
        } else if (this.action === actions.UPDATE) {
            await this.handleUpdate();
        }
    }

    async handleCreate() {
        this.isSubmit = true;
        console.log(this.cruForm.value);

        if (this.cruForm.invalid) {
            console.log('INVALID FORM');
            if (this.cruForm.get('image_url')?.hasError('required')) {
                this.dialogService.open(ErrorComponent, {
                    context: {
                        title: 'Không hợp lệ',
                        content: 'Ảnh đại diện không được để trống. Vui lòng thêm để hoàn tất thao tác.'
                    }
                })
            }
            return;
        }

        try {
            const instance = this.convertValueFormToModel();
            const response = await this.categoryManagement.addNewCategory(
                instance,
                this.selectedFile,
            );
            this.ref.close(response);
        } catch (error) {
            console.log(error);
            if (error instanceof ErrorModel) {
                if (error.code === HttpCode.BAD_REQUEST) {
                    if (error.message.includes("Tên danh mục đã tồn tại")) {
                        this.cruForm.get('category_name')?.setErrors({
                            unique: true
                        });
                    }
                }
            }
        }
    }

    protected async handleUpdate() {
        this.isSubmit = true;

        if (this.cruForm.invalid) {
            console.log('INVALID FORM');
            console.log(this.cruForm.value);
            return;
        }

        try {
            const instance = this.convertValueFormToModel();
            const response = await this.categoryManagement.updateCategory(
                instance,
                this.selectedFile
            );
            this.ref.close(response);
        } catch (error) {
            console.log(error);
            if (error instanceof ErrorModel) {
                if (error.code === HttpCode.BAD_REQUEST) {
                    if (error.message.includes("Tên danh mục đã tồn tại")) {
                        this.cruForm.get('category_name')?.setErrors({
                            unique: true
                        });
                    }
                }
            }
        }
    }

    protected convertValueFormToModel() {
        const model = new CategoryModel();

        model.id = this.categoryModel.id;
        model.category_name = this.cruForm.getRawValue().category_name;
        model.description = this.cruForm.getRawValue().delete_button;

        return model;
    }
}