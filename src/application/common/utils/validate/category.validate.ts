import { AbstractControl, FormArray, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export class CategoryValidate {

    static uniqueSubCategory(categoryNames: string[]): ValidatorFn {
        return (
            control: AbstractControl
        ): ValidationErrors | null => {

            const value = control.value;
            if (value?.trim() === '' || value === null || value === undefined) {
                return null;
            }

            if (categoryNames.includes(value)) {
                return { conflictName: true };
            }

            return null;
        }
    }
}