import { AbstractControl, ValidationErrors } from "@angular/forms";

export class ValueValidators {

    static isNumber(control: AbstractControl): ValidationErrors | null {

        const value = control.value;

        if (value.trim() === '' || value === undefined || value === null) {
            return null;
        }

        if (isNaN(value.trim())) {
            return { isNumber: true }
        }

        return null;
    }
}