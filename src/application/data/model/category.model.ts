export class CategoryModel {
    id?: number;
    category_name?: string;
    image_url?: string;
    description?: string;
    parentId?: number;
    sub_categories?: CategoryModel[];
    editMode?: boolean;
    createdAt?: string;
    updatedAt?: string;

    constructor(
        id?: number,
        category_name?: string,
        image_url?: string,
        description?: string,
        parentId?: number,
        sub_categories?: CategoryModel[],
        createdAt?: string,
        updatedAt?: string,
    ) {
        this.id = id ?? 0;
        this.category_name = category_name ?? '';
        this.image_url = image_url ?? '';
        this.description = description ?? '';
        this.parentId = parentId ?? 0;
        this.sub_categories = sub_categories ?? [];
        this.createdAt = createdAt ?? '';
        this.updatedAt = updatedAt ?? '';
    }

    convertSubObj(data: any) {
        const category = new CategoryModel();
        category.id = data?.id;
        category.category_name = data?.category_name;
        category.parentId = data?.parentId;

        return category;
    }

    convertObj(data: any) {
        const obj = new CategoryModel();
        obj.id = data?.id;
        obj.category_name = data?.category_name;
        obj.image_url = data?.image_url;
        obj.description = data?.description;
        obj.parentId = data?.parentId;
        obj.createdAt = data?.createdAt;
        obj.updatedAt = data?.updatedAt;
        obj.sub_categories = data?.children?.map(
            (subCate: any) => new CategoryModel().convertSubObj(subCate)
        );

        return obj;
    }

    convertModelToAdd(model: CategoryModel) {
        return {
            category_name: model.category_name,
            description: model.description
        }
    }

    convertModelToUpdate(model: CategoryModel) {
        return {
            category_name: model.category_name,
            description: model.description
        }
    }

    convertSubCategoryModelToExecute(model: CategoryModel) {
        return {
            category_name: model.category_name,
            parentId: model.parentId
        }
    }

}