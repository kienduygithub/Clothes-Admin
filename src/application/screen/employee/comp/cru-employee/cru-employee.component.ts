import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ImageResource } from "../../../../common/resource/image_resource";
import { UserModel } from "../../../../data/model/user.model";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { actions } from "../../../../common/resource/actions";
import { NbButtonModule, NbCheckboxModule, NbInputModule, NbSelectModule } from "@nebular/theme";
import { UserManagement } from "../../../../data/management/user.management";
import { UserService } from "../../../../data/service/user.service";
import { AppConfig } from "../../../../common/config/app.config";

const NB_LIBS = [
    NbInputModule,
    NbButtonModule,
    NbSelectModule,
    NbCheckboxModule
]

@Component({
    standalone: true,
    selector: 'cru-employee-component',
    templateUrl: './cru-employee.component.html',
    styleUrl: './cru-employee.component.scss',
    imports: [
        ...NB_LIBS,
        CommonModule,
        ReactiveFormsModule
    ],
    providers: [
        UserManagement,
        UserService
    ]
})

export class CRUEmployeeComponent implements OnInit {

    icons_arrow_line = ImageResource.icons_arrow_line;
    icon_upload_v2 = ImageResource.icon_upload_v2;
    icon_delete = ImageResource.delete_button;
    image_not_found: string = ImageResource.image_not_found;
    image_no_avatar: string = ImageResource.image_no_avatar;
    preImage: string = '';

    actionWebs = actions;
    action = this.actionWebs.CREATE;
    isSubmit: boolean = false;
    cruForm!: FormGroup;
    updatedUser!: UserModel;
    updatedId!: number;
    updatedName!: string;
    selectedImageFile!: File;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private appConfig: AppConfig,
        private formBuilder: FormBuilder,
        private userManagement: UserManagement
    ) { }

    async ngOnInit() {
        this.preImage = this.appConfig.getPreImage() ?? "";
        this.checkCreateOrUpdate();
    }

    checkCreateOrUpdate() {
        this.activatedRoute.queryParams.subscribe(async (params) => {
            if (params['id']) {
                this.action = actions.UPDATE;
                this.updatedId = params['id'];
                await this.initUpdateForm();
            } else {
                this.action = actions.CREATE;
                this.initCreateForm();
            }
        })
    }

    initCreateForm() {
        this.cruForm = this.formBuilder.group({
            name: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
            phone: ['', [Validators.required]],
            gender: ['1'],
            address: [''],
            image_url: ['', [Validators.required]],
            shopId: [0],
            roles: ['Admin']
        });
    }

    async initUpdateForm() {
        try {

        } catch (error) {
            console.log(error);
        }
        if (!this.updatedUser) {
            this.action = actions.CREATE;
            this.initCreateForm();
        } else {
            this.updatedName = this.updatedUser.name ?? '';
            this.cruForm = this.formBuilder.group({

            });

        }
    }

    onChangeAvatarFile(files: any) {
        if (files && files[0]) {
            this.selectedImageFile = files[0];
            this.cruForm.get('image_url')?.patchValue(
                URL.createObjectURL(files[0]),
                { emitEvent: false }
            );
        }
    }

    onCancel() {
        this.router.navigate(['/employee/list']);
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

        if (this.cruForm.invalid) {
            console.log('INVALID FORM');
            console.log(this.cruForm.value);
            return;
        }

        try {
            const instance = this.convertValueFormToModel();
            await this.userManagement.createUser(instance, this.selectedImageFile);
            this.onCancel();
        } catch (error) {
            console.log(error);
        }
    }

    async handleUpdate() {
        try {

        } catch (error) {
            console.log(error);
        }
    }

    convertValueFormToModel() {
        const model = new UserModel();

        if (this.action === actions.UPDATE) {
            model.id = this.updatedId;
        }
        model.name = this.updatedName === this.cruForm.getRawValue().name ? undefined : this.cruForm.getRawValue().name;
        model.email = this.cruForm.getRawValue().email;
        model.password = this.cruForm.getRawValue().password;
        model.phone = this.cruForm.getRawValue().phone;
        model.address = this.cruForm.getRawValue().address;
        model.gender = Number(this.cruForm.getRawValue().gender);
        model.roles = this.cruForm.getRawValue().roles;
        model.shopId = this.cruForm.getRawValue().shopId;

        console.log(model);

        return model;
    }
}