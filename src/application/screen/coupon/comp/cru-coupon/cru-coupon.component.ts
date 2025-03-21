import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NbButtonModule, NbCheckboxModule, NbDialogService, NbIconModule, NbInputModule, NbSelectModule, NbTooltipModule } from "@nebular/theme";
import { ShopModel } from "../../../../data/model/shop.model";
import { actions } from "../../../../common/resource/actions";
import { ImageResource } from "../../../../common/resource/image_resource";
import { AppConfig } from "../../../../common/config/app.config";
import { ValueValidators } from "../../../../common/utils/validate/value.validate";
import { CouponUrl } from "../../coupon.routing";
import { CouponManagement } from "../../../../data/management/coupon.management";
import { CouponService } from "../../../../data/service/coupon.service";
import { UuidService } from "../../../../common/service/uuid.service";
import { DiscountType } from "../../../../common/resource/coupon";
import { DatePickerComponent } from "../../../common/date-picker/custom-select.component";
import { CouponModel } from "../../../../data/model/coupon/coupon.model";

const NB_LIBS = [
    NbInputModule,
    NbButtonModule,
    NbTooltipModule,
    NbSelectModule,
    NbIconModule,
    NbCheckboxModule
]

const ANGULAR_MODULES = [
    CommonModule,
    ReactiveFormsModule,
]

const PROVIDERS = [
    CouponManagement,
    CouponService
]

@Component({
    standalone: true,
    selector: 'cru-coupon-component',
    templateUrl: './cru-coupon.component.html',
    styleUrl: './cru-coupon.component.scss',
    imports: [
        ...NB_LIBS,
        ...ANGULAR_MODULES,
        DatePickerComponent
    ],
    providers: [...PROVIDERS]
})

export class CRUCouponComponent implements OnInit {

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
    discountType = DiscountType;

    @ViewChild('fromTime') fromTime!: ElementRef<DatePickerComponent>;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private appConfig: AppConfig,
        private formBuilder: FormBuilder,
        private dialogService: NbDialogService,
        private couponManagement: CouponManagement,
        private uuidService: UuidService,
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
                await this.initUpdateForm();
            } else {
                this.action = actions.CREATE;
                this.initCreateForm();
            }
        })
    }

    initCreateForm() {
        this.cruForm = this.formBuilder.group({
            id: [''],
            coupon_name: ['', [ValueValidators.required]],
            code: [{ value: this.uuidService.generateUuid(), disabled: true }, [ValueValidators.required]],
            discount_type: [DiscountType.PERCENTAGE],
            discount_value: ['', [Validators.required, ValueValidators.isNumber, this.checkDiscountValueValid(DiscountType.PERCENTAGE)]],
            max_discount: ['', [Validators.required, ValueValidators.isNumber, this.checkMinValueValid]],
            min_order_value: ['', [Validators.required, ValueValidators.isNumber, this.checkMinValueValid]],
            times_used: [''],
            max_usage: [{ value: '', disabled: true }],
            valid_from: [''],
            valid_to: [''],
            unlimited_time: [false],
            unlimited_usage: [true]
        }, {
            validators: [this.checkFromToTimeValid]
        });

        this.unlimitedUsageValueChanges();
        this.unlimitedTimeValueChanges();
        this.discountTypeValueChanges();
    }

    async initUpdateForm() {
        try {

        } catch (error) {
            console.log(error);
        }
        if (true) {
            this.action = actions.CREATE;
            this.initCreateForm();
        } else {
            this.cruForm = this.formBuilder.group({

            });
        }
    }

    private unlimitedUsageValueChanges() {
        this.cruForm.get('unlimited_usage')?.valueChanges.subscribe((value) => {
            if (value === false) {
                this.cruForm.get('max_usage')?.enable();
                this.cruForm.get('max_usage')?.setValidators([
                    Validators.required,
                    ValueValidators.isNumber,
                    this.checkMinValueValid
                ])
            } else {
                this.cruForm.get('max_usage')?.disable();
                this.cruForm.get('max_usage')?.patchValue('', { emitEvent: false });
                this.cruForm.get('max_usage')?.markAsDirty();
                this.cruForm.get('max_usage')?.clearValidators();
                this.cruForm.get('max_usage')?.updateValueAndValidity();
            }
        })
    }

    private unlimitedTimeValueChanges() {
        this.cruForm.get('unlimited_time')?.valueChanges.subscribe((value) => {
            if (value === true) {
                this.cruForm.get('valid_from')?.clearValidators();
                this.cruForm.get('valid_from')?.updateValueAndValidity();
                this.cruForm.get('valid_from')?.markAsPristine();

                this.cruForm.get('valid_to')?.clearValidators();
                this.cruForm.get('valid_to')?.updateValueAndValidity();
                this.cruForm.get('valid_to')?.markAsPristine();
                this.cruForm.clearValidators();
                this.cruForm.updateValueAndValidity();
            } else {
                this.cruForm.get('valid_from')?.enable();
                this.cruForm.get('valid_from')?.setValidators([Validators.required]);
                this.cruForm.get('valid_from')?.updateValueAndValidity();
                this.cruForm.get('valid_from')?.markAsPristine();

                this.cruForm.get('valid_to')?.enable();
                this.cruForm.get('valid_to')?.setValidators([Validators.required]);
                this.cruForm.get('valid_to')?.updateValueAndValidity();
                this.cruForm.get('valid_to')?.markAsPristine();

                this.cruForm.setValidators([this.checkFromToTimeValid]);
                this.cruForm.updateValueAndValidity();
            }
        })
    }

    private discountTypeValueChanges() {
        this.cruForm.get('discount_type')?.valueChanges
            .subscribe((value) => {
                if (value === DiscountType.PERCENTAGE) {
                    this.cruForm.get('discount_value')?.setValidators([
                        Validators.required,
                        ValueValidators.isNumber,
                        this.checkDiscountValueValid(DiscountType.PERCENTAGE)
                    ]);
                    this.cruForm.get('discount_value')?.updateValueAndValidity();
                } else if (value === DiscountType.FIXED) {
                    this.cruForm.get('discount_value')?.setValidators([
                        Validators.required,
                        ValueValidators.isNumber,
                        this.checkDiscountValueValid(DiscountType.FIXED)
                    ]);
                    this.cruForm.get('discount_value')?.updateValueAndValidity();
                }
            })
    }

    onCancel() {
        this.router.navigate([CouponUrl.COUPON_LIST_URL]);
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
            return;
        }

        try {
            const instance = new CouponModel().convertFormToModel(this.cruForm);
            console.log(instance);
            // this.onCancel();
        } catch (error) {
            console.log(error);
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

            this.onCancel();
        } catch (error) {
            console.log(error);
        }
    }

    convertValueFormToModel() {
        const model = new ShopModel();

        if (this.action === actions.UPDATE) {
            // model.id = this.updatedId;
        }


        return model;
    }

    generateCode() {
        this.cruForm.get('code')?.patchValue(
            this.uuidService.generateUuid()
        );
    }

    checkFromToTimeValid(control: AbstractControl): ValidationErrors | null {
        const fromTime = control.get('valid_from');
        const toTime = control.get('valid_to');

        if (!fromTime || !toTime) {
            return null;
        }

        const fromTimeValue = fromTime.value?.trim() ?? '';
        const toTimeValue = toTime.value?.trim() ?? '';

        if (fromTimeValue === '' || toTimeValue === '') {
            return null;
        }

        const parseDate = (dateStr: string): Date | null => {
            if (!dateStr) return null;

            const [day, month, year] = dateStr.split('/').map(Number);
            return new Date(year, month - 1, day);
        }

        const parseFromTimeDate = parseDate(fromTimeValue);
        const parseToTimeDate = parseDate(toTimeValue);

        if (!parseFromTimeDate || !parseToTimeDate) {
            return null;
        }

        if (parseFromTimeDate > parseToTimeDate) {
            return {
                invalidRangeDate: true
            }
        }

        return null;
    }

    checkDiscountValueValid(discountType: 'percentage' | 'fixed'): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {

            const value = control.value?.trim();

            if (value === '' || value === undefined || value === '') {
                return null;
            }

            if (isNaN(value)) {
                return null;
            }

            if (+value <= 0) {
                return {
                    mustBeGreaterThanZero: true
                }
            }

            if (discountType === 'percentage' && +value > 100) {
                return {
                    invalidValue: true
                }
            }

            return null;
        }
    }

    checkMinValueValid(control: AbstractControl): ValidationErrors | null {
        const value = control.value?.trim();

        if (value === '' || value === undefined || value === '') {
            return null;
        }

        if (isNaN(value)) {
            return null;
        }

        if (+value <= 0) {
            return {
                mustBeGreaterThanZero: true
            }
        }

        return null;
    }

}