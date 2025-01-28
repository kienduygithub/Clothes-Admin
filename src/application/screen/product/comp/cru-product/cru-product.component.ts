import { Component, OnInit } from "@angular/core";
import { ImageResource } from "../../../../common/resource/image_resource";
import { CommonModule } from "@angular/common";
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { NbButtonModule, NbCheckboxModule, NbInputModule, NbSelectModule } from "@nebular/theme";
import { countries } from "../../../../common/resource/country_resource";
import { ActivatedRoute, Router } from "@angular/router";
import { actions } from "../../../../common/resource/actions";
import { ValueValidators } from "../../../../common/utils/validate/value.validate";
import { ProductImagesModel, ProductModel } from "../../../../data/model/product.model";
import { ProductManagement } from "../../../../data/management/product.management";
import { ProductService } from "../../../../data/service/product.service";
import { AppConfig } from "../../../../common/config/app.config";
import { ColorModel } from "../../../../data/model/attribute/color.model";
import { SizeModel } from "../../../../data/model/attribute/size.model";
import { AttributeManagement } from "../../../../data/management/attribute.management";
import { AttributeService } from "../../../../data/service/attribute.service";

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
        ProductService,
        AttributeManagement,
        AttributeService
    ]
})

export class CRUProductComponent implements OnInit {

    icons_arrow_line = ImageResource.icons_arrow_line;
    icon_upload_v2 = ImageResource.icon_upload_v2;
    icon_delete = ImageResource.delete_button;

    preImage: string = '';
    originList: string[] = countries;

    actionWebs = actions;
    action = this.actionWebs.CREATE;
    cruForm!: FormGroup;
    updatedProduct!: ProductModel;
    updatedId!: number;
    updatedName!: string;
    updatedImageUrls: ProductImagesModel[] = [];

    selectedInfoFiles: File[] = [];
    infoImageUrls: { url: string, isNew: boolean }[] = [];

    allColors: ColorModel[] = [];
    allSizes: SizeModel[] = [];

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private appConfig: AppConfig,
        private formBuilder: FormBuilder,
        private productManagement: ProductManagement,
        private attributeManagement: AttributeManagement
    ) { }

    async ngOnInit() {
        await this.fetchAllAttributes();
        this.preImage = this.appConfig.getPreImage() ?? "";
        this.checkCreateOrUpdate();
    }

    async fetchAllAttributes() {
        try {
            this.allColors = await this.attributeManagement.fetchAllColors();
            this.allSizes = await this.attributeManagement.fetchAllSizes();

            console.log(this.allColors);
            console.log(this.allSizes);
        } catch (error) {
            console.log(error);
        }
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
            product_name: this.formBuilder.control('', [Validators.required]),
            origin: this.formBuilder.control('', [Validators.required]),
            unit_price: this.formBuilder.control('', [Validators.required, ValueValidators.isNumber]),
            description: this.formBuilder.control(''),
            image_urls: this.formBuilder.array([])
        });
    }

    async initUpdateForm() {
        try {
            this.updatedProduct = await this.productManagement.fetchProductById(this.updatedId);
        } catch (error) {
            console.log(error);
        }
        if (!this.updatedProduct) {
            this.action = actions.CREATE;
            this.initCreateForm();
        } else {
            this.updatedName = this.updatedProduct.product_name ?? '';
            this.cruForm = this.formBuilder.group({
                product_name: this.formBuilder.control(this.updatedProduct.product_name ?? '', [Validators.required]),
                origin: this.formBuilder.control(this.updatedProduct.origin, [Validators.required]),
                unit_price: this.formBuilder.control(this.updatedProduct.unit_price, [Validators.required, ValueValidators.isNumber]),
                description: this.formBuilder.control(this.updatedProduct.description),
                image_urls: this.formBuilder.array([])
            });
            this.updatedImageUrls = this.updatedProduct.image_urls?.map(item => item) ?? [];
            this.updatedImageUrls.forEach(item => {
                this.getArrayControl('image_urls').push(
                    this.formBuilder.group({
                        id: this.formBuilder.control(item.id),
                        productId: this.formBuilder.control(item.productId),
                        image_url: this.formBuilder.control(item.image_url)
                    })
                )
            });
        }
    }

    onCancel() {
        this.router.navigate(['/shop/product/products']);
    }

    async onSave() {
        if (this.action === actions.CREATE) {
            await this.handleCreate();
        } else if (this.action === actions.UPDATE) {
            await this.handleUpdate();
        }
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

    async handleUpdate() {
        console.log(this.cruForm.value);
        if (this.cruForm.invalid) {
            console.log('INVALID FORM');
            return;
        }

        try {
            const instance = this.convertValueFormToModel();
            await this.productManagement.updateProduct(instance, this.selectedInfoFiles);
        } catch (error) {
            console.log(error);
        }
    }

    convertValueFormToModel() {
        const model = new ProductModel();

        if (this.action === this.actionWebs.UPDATE) {
            model.id = this.updatedId;
        }
        model.shopId = 1; // Tạm thời thế
        model.product_name = this.cruForm.getRawValue().product_name === this.updatedName ? undefined : this.cruForm.getRawValue().product_name;
        model.origin = this.cruForm.getRawValue().origin;
        model.unit_price = this.cruForm.getRawValue().unit_price;
        model.description = this.cruForm.getRawValue().description;
        model.image_urls = this.cruForm.getRawValue().image_urls;

        return model;
    }

    getFormControl(controlName: string) {
        return this.cruForm.get(controlName);
    }

    getArrayControl(controlName: string) {
        return this.cruForm.get(controlName) as FormArray;
    };

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
        if (isNew) {
            this.infoImageUrls.splice(index, 1);
            this.selectedInfoFiles.splice(index, 1);
        } else {
            this.getArrayControl('image_urls').removeAt(index);
        }
    }
}