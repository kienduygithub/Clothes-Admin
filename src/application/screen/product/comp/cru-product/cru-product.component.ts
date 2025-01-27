import { Component, OnInit } from "@angular/core";
import { ImageResource } from "../../../../common/resource/image_resource";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { NbButtonModule, NbCheckboxModule, NbInputModule, NbSelectModule } from "@nebular/theme";
import { countries } from "../../../../common/resource/country_resource";
import { ActivatedRoute, Router } from "@angular/router";
import { actions } from "../../../../common/resource/actions";
import { ValueValidators } from "../../../../common/utils/validate/value.validate";
import { ProductModel } from "../../../../data/model/product.model";
import { ProductManagement } from "../../../../data/management/product.management";
import { ProductService } from "../../../../data/service/product.service";

const NB_LIBS = [
    NbInputModule,
    NbButtonModule,
    NbSelectModule,
    NbCheckboxModule
]

declare const $: any;

@Component({
    standalone: true,
    selector: 'cru-product-component',
    templateUrl: './cru-product.component.html',
    styleUrl: './cru-product.component.scss',
    imports: [
        ...NB_LIBS,
        CommonModule,
        ReactiveFormsModule
    ],
    providers: [
        ProductManagement,
        ProductService
    ]
})

export class CRUProductComponent implements OnInit {

    icons_arrow_line = ImageResource.icons_arrow_line;
    icon_upload_v2 = ImageResource.icon_upload_v2;
    icon_delete = ImageResource.delete_button;

    originList: string[] = countries;

    actionWebs = actions;
    action = this.actionWebs.CREATE;
    cruForm!: FormGroup;
    updatedProduct!: ProductModel;

    selectedInfoFiles: File[] = [];
    infoImageUrls: { url: string, isNew: boolean }[] = [];

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        private productManagement: ProductManagement
    ) { }

    ngOnInit() {
        this.checkCreateOrUpdate();
    }

    checkCreateOrUpdate() {
        this.activatedRoute.queryParams.subscribe((params) => {
            if (params['id']) {
                this.action = actions.UPDATE;
                this.initUpdateForm();
            } else {
                this.action = actions.CREATE;
                this.initCreateForm();
            }
        })
    }

    initCreateForm() {
        this.cruForm = this.formBuilder.group({
            product_name: this.formBuilder.control('', [Validators.required]),
            origin: this.formBuilder.control('', [Validators.required]),
            unit_price: this.formBuilder.control('', [Validators.required, ValueValidators.isNumber]),
            description: this.formBuilder.control('')
        });
    }

    initUpdateForm() {
        try {

        } catch (error) {
            console.log(error);
        }
        if (!this.updatedProduct) {
            // this.action = actions.CREATE;
            this.initCreateForm();
        }
    }

    onCancel() {
        this.router.navigate(['/shop/product/products']);
    }

    onSave() {
        this.handleCreate();
    }

    async handleCreate() {
        console.log(this.cruForm.value);
        if (this.cruForm.invalid) {
            console.log('INVALID FORM');
            return;
        }

        try {
            const instance = this.convertValueFormToModel();
            await this.productManagement.createNewProduct(instance, this.selectedInfoFiles);
        } catch (error) {
            console.log(error);
        }
    }

    convertValueFormToModel() {
        const model = new ProductModel();

        if (this.action === this.actionWebs.UPDATE) {
            model.id = this.cruForm.getRawValue().id;
        }
        model.shopId = 1; // Tạm thời thế
        model.product_name = this.cruForm.getRawValue().product_name;
        model.origin = this.cruForm.getRawValue().origin;
        model.unit_price = this.cruForm.getRawValue().unit_price;
        model.description = this.cruForm.getRawValue().description;

        return model;
    }

    onChangeFiles(event: any, files: any) {
        const fileLists = files as FileList;

        if (fileLists.length > 10) {
            alert("Chỉ được tải lên tôi đa 10 tệp!");
            event.target.value = "";
            return;
        }

        for (let i = 0; i < fileLists.length; i++) {
            const file = fileLists.item(i);
            if (file) {
                this.selectedInfoFiles.push(file);
                const imageUrl = URL.createObjectURL(file);
                this.infoImageUrls.push({ url: imageUrl, isNew: true });
            }
        }
    }

    onRemoveInfoImageFiles(index: number, isNew: boolean) {
        this.infoImageUrls.splice(index, 1);
        if (isNew) {
            this.selectedInfoFiles.splice(index, 1);
        }
    }
}