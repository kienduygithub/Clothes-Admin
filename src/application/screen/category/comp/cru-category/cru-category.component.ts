import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { CategoryManagement } from "../../../../data/management/category.management";
import { CategoryService } from "../../../../data/service/category.service";
import { ActivatedRoute, Router } from "@angular/router";
import { NbButtonModule, NbDialogService, NbIconModule, NbInputModule, NbSelectModule, NbTooltipModule } from "@nebular/theme";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ImageResource } from "../../../../common/resource/image_resource";
import { actions } from "../../../../common/resource/actions";
import { CategoryModel } from "../../../../data/model/category.model";
import { AppConfig } from "../../../../common/config/app.config";
import { ValueValidators } from "../../../../common/utils/validate/value.validate";
import { ErrorComponent } from "../../../../common/layout/notify/error/error.component";
import { CategoryUrl } from "../../category.routing";
import { ErrorModel } from "../../../../common/model/error";
import { HttpCode } from "../../../../common/resource/http-code";

const NB_LIBS = [
    NbInputModule,
    NbButtonModule,
    NbTooltipModule,
    NbSelectModule,
    NbIconModule
]

@Component({
    standalone: true,
    selector: 'cru-category-component',
    templateUrl: './cru-category.component.html',
    styleUrl: './cru-category.component.scss',
    imports: [
        ...NB_LIBS,
        CommonModule,
        ReactiveFormsModule
    ],
    providers: [
        CategoryManagement,
        CategoryService
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class CRUCategoryComponent implements OnInit {
    icons_arrow_line = ImageResource.icons_arrow_line;
    icon_upload_v4 = ImageResource.icon_upload_v4;
    icon_upload_v3 = ImageResource.icon_upload_v3;

    icon_delete = ImageResource.delete_button;
    icon_visible_eye = ImageResource.icon_visible_eye;
    icon_invisible_eye = ImageResource.icon_invisible_eye;
    icon_no_logo_shop = ImageResource.icon_no_logo_shop;
    image_not_found: string = ImageResource.image_not_found;
    image_no_avatar: string = ImageResource.image_no_avatar;
    preImage: string = '';

    actionWebs = actions;
    action = this.actionWebs.CREATE;
    isSubmit: boolean = false;
    cruForm!: FormGroup;
    updatedId!: number;
    updatedCategory!: CategoryModel;
    selectedFile!: File;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private dialogService: NbDialogService,
        private appConfig: AppConfig,
        private formBuilder: FormBuilder,
        private categoryManagement: CategoryManagement,
        private cdr: ChangeDetectorRef
    ) { }

    async ngOnInit() {
        this.preImage = this.appConfig.getPreImage() ?? "";
        this.checkCreateOrUpdate();
    }

    checkCreateOrUpdate() {
        this.activatedRoute.queryParams.subscribe(async (params) => {
            if (params['id']) {
                this.action = actions.UPDATE;
                this.updatedId = +params['id'];
                await this.initUpdateForm();
            } else {
                this.action = actions.CREATE;
                this.initCreateForm();
            }
        })
    }

    initCreateForm() {
        this.cruForm = this.formBuilder.group({
            category_name: ['', [ValueValidators.required]],
            image_url: ['', [ValueValidators.required]],
            description: ['']
        });

    }

    async initUpdateForm() {
        try {
            this.updatedCategory = await this.categoryManagement.fetchCategoryByParentId(this.updatedId);
        } catch (error) {
            console.log(error);
        }
        if (!this.updatedCategory) {
            this.action = actions.CREATE;
            this.updatedId = 0;
            this.initCreateForm();
        } else {
            this.cruForm = this.formBuilder.group({
                category_name: [this.updatedCategory.category_name, [ValueValidators.required]],
                image_url: [this.updatedCategory.image_url, [ValueValidators.required]],
                description: [this.updatedCategory.description]
            });
        }

        this.cdr.detectChanges();
    }

    onChangeLogoFile(files: any) {
        if (files && files.length > 0) {
            this.selectedFile = files[0];
            this.cruForm.patchValue({
                image_url: URL.createObjectURL(files[0])
            }, { emitEvent: false });
        }
    }

    onCancel() {
        this.router.navigate([CategoryUrl.CATEGORY_URL]);
    }

    async onSave() {
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
            await this.categoryManagement.addNewCategory(
                instance,
                this.selectedFile,
            );
            this.onCancel();
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

    async handleUpdate() {
        this.isSubmit = true;

        if (this.cruForm.invalid) {
            console.log('INVALID FORM');
            console.log(this.cruForm.value);
            return;
        }

        try {
            const instance = this.convertValueFormToModel();
            await this.categoryManagement.updateCategory(
                instance,
                this.selectedFile
            );
            this.onCancel();
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

    convertValueFormToModel() {
        const model = new CategoryModel();

        if (this.action === actions.UPDATE) {
            model.id = this.updatedId;
        }
        model.category_name = this.cruForm.getRawValue().category_name;
        model.description = this.cruForm.getRawValue().delete_button;

        return model;
    }
}