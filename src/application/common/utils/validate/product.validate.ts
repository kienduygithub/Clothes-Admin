import { AbstractControl, FormArray, FormGroup, ValidationErrors } from "@angular/forms";

export class ProductValidate {

    static uniqueVariantsValidator(
        control: AbstractControl
    ): ValidationErrors | null {
        if (!control.value || !Array.isArray(control.value)) {
            return null;
        }

        const variants = control as FormArray;
        const seen = new Map<string, FormGroup>();

        variants.controls.forEach((group: AbstractControl) => {
            const groupForm = group as FormGroup;
            const color = group.get('colorId')?.value;
            const size = group.get('sizeId')?.value;

            if (!color || !size) {
                return;
            }

            const key = `${color}-${size}`;
            if (seen.has(key)) {
                groupForm.get('colorId')?.setErrors({ unique: true });
                groupForm.get('sizeId')?.setErrors({ unique: true });

                seen.get(key)?.get('colorId')?.setErrors({ unique: true });
                seen.get(key)?.get('sizeId')?.setErrors({ unique: true });
                return;
            }

            seen.set(key, groupForm);
            groupForm.get('colorId')?.setErrors(null);
            groupForm.get('sizeId')?.setErrors(null);
        })

        return null
    }
}