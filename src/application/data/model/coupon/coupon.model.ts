import { FormGroup } from "@angular/forms";
import { DateUtils } from "../../../common/utils/convert-date";
import { CouponStatus } from "../../../common/resource/status";

export class CouponModel {
    id: number;
    shop_id: number;
    name: string;
    code: string;
    discount_type: string;
    discount_value: number;
    max_discount: number;
    min_order_value: number;
    times_used: number;
    max_usage: number;
    valid_from: string;
    valid_to: string;
    status: number;

    constructor(
        id?: number,
        shop_id?: number,
        name?: string,
        code?: string,
        discount_type?: string,
        discount_value?: number,
        max_discount?: number,
        min_order_value?: number,
        times_used?: number,
        max_usage?: number,
        valid_from?: string,
        valid_to?: string,
        status?: number,
    ) {
        this.id = id ?? 0;
        this.shop_id = shop_id ?? 0;
        this.name = name ?? '';
        this.code = code ?? '';
        this.discount_type = discount_type ?? '';
        this.discount_value = discount_value ?? 0;
        this.max_discount = max_discount ?? 0;
        this.min_order_value = min_order_value ?? 0;
        this.times_used = times_used ?? 0;
        this.max_usage = max_usage ?? 0;
        this.valid_from = valid_from ?? '';
        this.valid_to = valid_to ?? '';
        this.status = status ?? CouponStatus.EXPIRED;
    }

    fromJson(data: any) {
        const model = new CouponModel();
        model.id = data.id ?? 0;
        model.shop_id = data.shop_id ?? 0;
        model.name = data.name ?? '';
        model.code = data.code ?? '';
        model.discount_type = data.discount_type ?? '';
        model.discount_value = data.discount_value ?? 0;
        model.max_discount = data.max_discount ?? 0;
        model.min_order_value = data.min_order_value ?? 0;
        model.times_used = data.times_used ?? 0;
        model.max_usage = data.max_usage ?? 0;
        model.valid_from = DateUtils.formatDateToDDMMYYYY(data.valid_from);
        model.valid_to = DateUtils.formatDateToDDMMYYYY(data.valid_to);
        model.status = data.status ?? CouponStatus.EXPIRED;

        return model;
    }

    toJson(data: CouponModel) {
        return {
            shop_id: data.shop_id,
            name: data.name,
            code: data.code,
            discount_type: data.discount_type,
            discount_value: data.discount_value,
            max_discount: data.max_discount,
            min_order_value: data.min_order_value,
            times_used: data.times_used,
            max_usage: data.max_usage,
            valid_from: data.valid_from,
            valid_to: data.valid_to,
        }
    }

    convertFormToModel(form: FormGroup) {
        const model = new CouponModel();
        model.id = form.getRawValue().id;
        model.shop_id = form.getRawValue().shop_id;
        model.name = form.getRawValue().name;
        model.code = form.getRawValue().code;
        model.discount_type = form.getRawValue().discount_type;
        model.discount_value = form.getRawValue().discount_value;
        model.max_discount = form.getRawValue().max_discount;
        model.min_order_value = form.getRawValue().min_order_value;
        model.times_used = form.getRawValue().times_used;
        model.max_usage = form.getRawValue().max_usage;
        model.valid_from = DateUtils.convertDDMMYYYYToISOStartOfDay(form.getRawValue().valid_from);
        model.valid_to = DateUtils.convertDDMMYYYYToISOStartOfDay(form.getRawValue().valid_to);

        return model;
    }


}