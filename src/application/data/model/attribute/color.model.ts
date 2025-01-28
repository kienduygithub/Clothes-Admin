export class ColorModel {
    id?: number;
    color_name?: string;
    color_code?: string;

    constructor(
        id?: number,
        color_name?: string,
        color_code?: string,
    ) {
        this.id = id ?? 0;
        this.color_name = color_name ?? "";
        this.color_code = color_code ?? "";
    }

    convertObj(obj: any) {
        const model = new ColorModel();
        model.id = obj.id;
        model.color_name = obj.color_name;
        model.color_code = obj.color_code;

        return model;
    }
}