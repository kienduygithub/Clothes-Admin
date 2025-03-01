import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ImageResource } from "../../../../common/resource/image_resource";
import { CommonModule } from "@angular/common";
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { NbButtonModule, NbCheckboxModule, NbDialogService, NbInputModule, NbSelectModule, NbTooltipModule } from "@nebular/theme";
import { countries } from "../../../../common/resource/country_resource";
import { ActivatedRoute, Router } from "@angular/router";
import { actions } from "../../../../common/resource/actions";
import { ValueValidators } from "../../../../common/utils/validate/value.validate";
import { ProductImagesModel, ProductModel, ProductVariantModel } from "../../../../data/model/product.model";
import { ProductManagement } from "../../../../data/management/product.management";
import { ProductService } from "../../../../data/service/product.service";
import { AppConfig } from "../../../../common/config/app.config";
import { ColorModel } from "../../../../data/model/attribute/color.model";
import { SizeModel } from "../../../../data/model/attribute/size.model";
import { AttributeManagement } from "../../../../data/management/attribute.management";
import { AttributeService } from "../../../../data/service/attribute.service";
import { TransformColorId } from "../../../../common/layout/pipes/transformColorId";
import { WarningComponent } from "../../../../common/layout/notify/warning/warnimg.component";
import { ProductValidate } from "../../../../common/utils/validate/product.validate";
import { Option } from "../../../../common/resource/option.interface";
import { GenderResource } from "../../../../common/resource/gender_resource";
import { CKEditorComponent } from "../../../../common/utils/ckeditor/ckeditor.component";
import { CategoryModel } from "../../../../data/model/category.model";
import { CategoryManagement } from "../../../../data/management/category.management";
import { CategoryService } from "../../../../data/service/category.service";
import { debounceTime } from "rxjs";

const NB_LIBS = [
    NbInputModule,
    NbButtonModule,
    NbSelectModule,
    NbCheckboxModule,
    NbTooltipModule
]

const PIPES = [
    TransformColorId
]

@Component({
    standalone: true,
    selector: 'cru-product-component',
    templateUrl: './cru-product.component.html',
    styleUrl: './cru-product.component.scss',
    imports: [
        ...NB_LIBS,
        ...PIPES,
        CommonModule,
        ReactiveFormsModule,
        CKEditorComponent,
    ],
    providers: [
        ProductManagement,
        ProductService,
        AttributeManagement,
        AttributeService,
        CategoryManagement,
        CategoryService
    ],
    // changeDetection: ChangeDetectionStrategy.OnPush
})

export class CRUProductComponent implements OnInit {

    icons_arrow_line = ImageResource.icons_arrow_line;
    icon_upload_v2 = ImageResource.icon_upload_v2;
    icon_delete = ImageResource.delete_button;
    image_not_found: string = ImageResource.image_not_found;

    preImage: string = '';
    originList: string[] = countries;
    genderProductList: Option[] = GenderResource;

    actionWebs = actions;
    action = this.actionWebs.CREATE;
    isSubmit: boolean = false;
    cruForm!: FormGroup;
    updatedProduct!: ProductModel;
    updatedId!: number;
    updatedName!: string;
    updatedImageUrls: ProductImagesModel[] = [];

    selectedInfoFiles: File[] = [];
    infoImageUrls: { url: string, isNew: boolean }[] = [];
    selectedVariantFiles: File[] = [];
    variantImageUrls = new Map<number, File | null>(); // Dùng cho thêm mới hoặc update (những biến thể thêm mới)
    variantUpdatedImages = new Map<number, File | null>(); // Chỉ dùng khi update ảnh biến thể tồn tại trên CSDL
    deletedVariantId: number[] = []; // Chỉ dùng khi xóa một biến thể tồn tại trên CSDL

    allColors: ColorModel[] = [];
    allSizes: SizeModel[] = [];
    categories = new Map<number, CategoryModel>([]);
    parentCategories: CategoryModel[] = [];
    childCategories: CategoryModel[] = [];
    timeSKU = Date.now();

    get product_variants(): FormArray {
        return this.cruForm.get('product_variants') as FormArray;
    }

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private appConfig: AppConfig,
        private formBuilder: FormBuilder,
        private productManagement: ProductManagement,
        private attributeManagement: AttributeManagement,
        private categoryManagement: CategoryManagement,
        private dialogService: NbDialogService,
        private cdr: ChangeDetectorRef
    ) { }

    async ngOnInit() {
        await this.fetchAllAttributes();
        await this.fetchAllCategories();
        this.preImage = this.appConfig.getPreImage() ?? "";
        this.checkCreateOrUpdate();
    }

    async fetchAllAttributes() {
        try {
            this.allColors = await this.attributeManagement.fetchAllColors();
            this.allSizes = await this.attributeManagement.fetchAllSizes();
        } catch (error) {
            console.log(error);
        }
    }

    async fetchAllCategories() {
        try {
            let allCategories = await this.categoryManagement.fetchCategories();
            allCategories.forEach(category => {
                this.categories.set(category.id ?? 0, category);
            })
            this.parentCategories = allCategories.filter(category => category.parentId === 0);
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
            product_name: this.formBuilder.control('', [ValueValidators.required]),
            origin: this.formBuilder.control('', [ValueValidators.required]),
            gender: this.formBuilder.control(this.genderProductList[0].value),
            unit_price: this.formBuilder.control('', [ValueValidators.required, ValueValidators.isNumber]),
            category1: this.formBuilder.control('', [Validators.required]),
            category2: this.formBuilder.control('', [Validators.required]),
            description: this.formBuilder.control(''),
            image_urls: this.formBuilder.array([]),
            product_variants: this.formBuilder.array([
                this.formBuilder.group({
                    id: this.formBuilder.control(this.timeSKU),
                    productId: this.updatedId ?? 0,
                    image_url: this.formBuilder.control('', [ValueValidators.required]),
                    colorId: this.formBuilder.control('', [ValueValidators.required]),
                    sizeId: this.formBuilder.control('', [ValueValidators.required]),
                    sku: this.formBuilder.control(`${this.timeSKU}`),
                    stock_quantity: this.formBuilder.control('0', [
                        ValueValidators.required, ValueValidators.isNumber
                    ]),
                    isTemp: true
                })
            ], [ProductValidate.uniqueVariantsValidator])
        });
        this.variantImageUrls.set(this.timeSKU, null);
        this.cruForm.get('category1')?.valueChanges
            .subscribe((response) => {
                this.cruForm.get('category2')?.patchValue('');
                this.cruForm.get('category2')?.markAsPristine();
                this.childCategories = this.parentCategories.find(cate => cate.id === response)
                    ?.sub_categories ?? [];
            })

        this.cdr.detectChanges();
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
                product_name: this.formBuilder.control(this.updatedProduct.product_name ?? '', [ValueValidators.required]),
                origin: this.formBuilder.control(this.updatedProduct.origin, [ValueValidators.required]),
                gender: this.formBuilder.control(this.updatedProduct.gender),
                unit_price: this.formBuilder.control(this.updatedProduct.unit_price, [ValueValidators.required, ValueValidators.isNumber]),
                category1: this.formBuilder.control(
                    this.categories.get(this.updatedProduct.category?.parentId ?? 0)?.id ?? 0,
                    [Validators.required]
                ),
                category2: this.formBuilder.control(this.updatedProduct.categoryId ?? 0, [Validators.required]),
                description: this.formBuilder.control(this.updatedProduct.description),
                image_urls: this.formBuilder.array([]),
                product_variants: this.formBuilder.array([])
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
            this.initVariantAsUpdate();
            this.initChildCategoriesAsUpdate();

            this.cruForm.get('category1')?.valueChanges
                .subscribe((response) => {
                    this.cruForm.get('category2')?.patchValue('');
                    this.cruForm.get('category2')?.markAsPristine();
                    this.childCategories = this.parentCategories.find(cate => cate.id === response)
                        ?.sub_categories ?? [];
                })
        }
    }

    initVariantAsUpdate() {
        const variants = this.updatedProduct.variants ?? [];
        for (let i = 0; i < variants?.length; i++) {
            this.getArrayControl('product_variants').push(
                this.formBuilder.group({
                    id: variants[i].id,
                    productId: variants[i].productId,
                    image_url: `${this.preImage}/${variants[i].image_url}`,
                    colorId: this.formBuilder.control(variants[i].colorId, [Validators.required]),
                    sizeId: this.formBuilder.control(variants[i].sizeId, [Validators.required]),
                    sku: variants[i].sku,
                    stock_quantity: this.formBuilder.control(
                        variants[i].stock_quantity?.toString() + "",
                        [Validators.required, ValueValidators.isNumber]
                    ),
                    isTemp: false
                })
            )
        }
    }

    initChildCategoriesAsUpdate() {
        let parentId = this.cruForm.getRawValue().category1;
        this.childCategories = this.parentCategories.find(cate => cate.id === parentId)
            ?.sub_categories ?? [];
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
        this.isSubmit = true;
        if (this.cruForm.invalid) {
            console.log(this.cruForm.value);
            console.log('INVALID FORM');
            return;
        }

        try {
            const instance = this.convertValueFormToModel();
            this.selectedVariantFiles = [...this.variantImageUrls.values()]
                .filter(file => file !== null)
                .reverse();
            await this.productManagement.createNewProduct(
                instance,
                this.selectedInfoFiles,
                this.selectedVariantFiles
            );

            this.router.navigate(['/shop/product/products']);
        } catch (error) {
            console.log(error);
        }
    }

    async handleUpdate() {
        this.isSubmit = true;
        if (this.cruForm.invalid) {
            console.log(this.cruForm.value);
            console.log('INVALID FORM');
            return;
        }

        try {
            const instance = this.convertValueFormToModel();
            // Danh sách File ảnh của biến thể mới
            this.selectedVariantFiles = [...this.variantImageUrls.values()].filter(file => file !== null);
            // Danh sách ID và File ảnh của biến thể thay đổi
            const updatedIds = Array.from(this.variantUpdatedImages.keys());
            const updatedFiles = Array.from(this.variantUpdatedImages.values());

            console.log(this.selectedVariantFiles);
            console.log(updatedIds);
            console.log(updatedFiles);

            await this.productManagement.updateProduct(
                instance,
                this.selectedInfoFiles,
                this.selectedVariantFiles,
                updatedIds,
                updatedFiles,
                this.deletedVariantId
            );

            this.router.navigate(['/shop/product/products']);
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
        model.gender = this.cruForm.getRawValue().gender;
        model.unit_price = this.cruForm.getRawValue().unit_price;
        model.description = this.cruForm.getRawValue().description;
        model.image_urls = this.cruForm.getRawValue().image_urls;
        model.variants = this.cruForm.getRawValue().product_variants.map((variant: any) => new ProductVariantModel().convertObj(variant));
        model.categoryId = this.cruForm.getRawValue().category2;

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

    onChangeVariantFile(id: number, event: any, isTemp: boolean) {
        if (event && event.target.files) {
            let file = event.target.files[0];
            if (isTemp === true) {
                // Cập nhật ảnh cho biến thể mới
                this.variantImageUrls.set(id, file);
                console.log(this.variantImageUrls);
            } else if (isTemp === false) {
                // Cập nhật ảnh cho biến thể cũ
                this.variantUpdatedImages.set(id, file);
                console.log(this.variantUpdatedImages);
            }
            const imageUrl = URL.createObjectURL(file);
            const variants = this.product_variants.controls;
            const variantIndex = this.product_variants.value.findIndex(
                (variant: any) => variant.id === id
            );
            if (variantIndex > -1) {
                variants.at(variantIndex)?.patchValue({
                    image_url: imageUrl
                });
            }
        }
    }

    onAddVariantControl() {
        this.timeSKU = Date.now();
        this.product_variants.insert(
            0,
            this.formBuilder.group({
                id: this.formBuilder.control(this.timeSKU),
                productId: (this.updatedId && Number(this.updatedId)) ?? 0,
                image_url: this.formBuilder.control('', [ValueValidators.required]),
                colorId: this.formBuilder.control('', [ValueValidators.required]),
                sizeId: this.formBuilder.control('', [ValueValidators.required]),
                sku: this.formBuilder.control(`${this.timeSKU}`),
                stock_quantity: this.formBuilder.control('0', [
                    ValueValidators.required,
                    ValueValidators.isNumber
                ]),
                isTemp: true
            })
        )
        this.variantImageUrls.set(this.timeSKU, null);
    }

    onConfirmDeleteVariant(id: number, isTemp: boolean) {
        this.dialogService.open(WarningComponent, {
            context: {
                title: 'Xóa',
                content: 'Bạn có chắc muốn xóa biến thể này?',
                acceptFunc: this.handleDeleteVariant.bind(this, id, isTemp)
            }
        })
    }

    handleDeleteVariant(id: number, isTemp: boolean) {
        if (isTemp) {
            this.variantImageUrls.delete(id);
        } else {
            if (this.variantUpdatedImages.has(id)) {
                this.variantUpdatedImages.delete(id);
            }
            this.deletedVariantId.push(id);
        }
        const variants = this.product_variants.controls;
        const variantIndex = this.product_variants.value.findIndex(
            (variant: any) => variant.id === id
        );
        if (variantIndex > -1) {
            variants.splice(variantIndex, 1);
            this.product_variants.patchValue(variants);
        }
    }
}