import { Pipe, PipeTransform } from "@angular/core";
import { ColorModel } from "../../../data/model/attribute/color.model";

@Pipe({
    standalone: true,
    name: 'transformColorId'
})
export class TransformColorId implements PipeTransform {
    transform(value: any, colors: ColorModel[]) {
        return colors.find(color => color.id === value)?.color_code ?? '';
    }
}