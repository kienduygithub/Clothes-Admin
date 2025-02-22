import { AbstractControl, FormArray, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";
import { CategoryModel } from "../../../data/model/category.model";

export class CategoryValidate {

    static uniqueSubCategory(categoryNameMap: Map<number, string>): ValidatorFn {
        return (
            control: AbstractControl
        ): ValidationErrors | null => {

            const value = control.value;
            if (value?.trim() === '' || value === null || value === undefined) {
                return null;
            }

            const names = Array.from(categoryNameMap.values());
            if (names.includes(value)) {
                return { conflictName: true };
            }

            return null;
        }
    }

    static uniqueSubCategoryOnTable(categoryNameMap: Map<number, string>): ValidatorFn {
        return (
            control: AbstractControl
        ): ValidationErrors | null => {
            const group = control as FormGroup;
            const id = group.get('id')?.value;
            const category_name = group.get('category_name')?.value?.trim();

            if (!id || category_name === '') {
                return null;
            }
            const nameMaps = new Map(categoryNameMap);
            nameMaps.delete(+id);

            const names = Array.from(nameMaps.values());
            if (names.includes(category_name)) {
                return {
                    conflictName: true
                }
            }

            return null
        }
    }
}