import { Pipe, PipeTransform } from "@angular/core";
import { ColorModel } from "../../../data/model/attribute/color.model";
import { ShopStatus } from "../../resource/status";

@Pipe({
    standalone: true,
    name: 'transformShopStatus'
})
export class TransformShopStatusPipe implements PipeTransform {
    transform(value: string) {
        switch (value) {
            case ShopStatus.ACTIVE:
                return 'Đang hoạt động';
            case ShopStatus.INACTIVE:
                return 'Ngưng hoạt động';
            case ShopStatus.PENDING:
                return 'Chờ xác nhận';
            default:
                return value;
        }
    }
}