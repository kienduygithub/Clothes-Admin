export class SizeModel {
    id?: number;
    size_code?: string;
    order_sequence?: number;

    constructor(
        id?: number,
        size_code?: string,
        order_sequence?: number,
    ) {
        this.id = id ?? 0;
        this.size_code = size_code ?? "";
        this.order_sequence = order_sequence ?? 0;
    }

    convertObj(obj: any) {
        const model = new SizeModel();
        model.id = obj.id;
        model.size_code = obj.size_code;
        model.order_sequence = obj.order_sequence;

        return model;
    }
}