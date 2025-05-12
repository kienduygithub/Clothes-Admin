import { Pipe, PipeTransform } from "@angular/core";
import { Option } from "../../utils/filter-stats/filter-stats.component";

@Pipe({
    standalone: true,
    name: 'getLabel'
})

export class GetLabelPipe implements PipeTransform {
    transform(value: string, options: Option[], property: 'label' | 'range' = 'label'): string {
        return options.find(opt => opt.value === value)?.[property] || (property === 'label' ? 'Chọn' : 'Range');
    }
}