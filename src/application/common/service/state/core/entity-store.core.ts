import { EntityState, EntityStore, getEntityType, getIDType, QueryEntity, StoreConfigOptions } from "@datorama/akita";
import { firstValueFrom } from "rxjs";

export class EntityStoreCore<
    T,
    S extends EntityState<T>
> extends EntityStore<S> {

    private query: QueryEntity<S>;

    constructor(
        initialState: S, storeConfig?: Partial<StoreConfigOptions>
    ) {
        super(initialState, storeConfig);
        this.query = new QueryEntity<S>(this);
    }

    getEntities(): getEntityType<S>[] {
        return this.query.getAll();
    }

    async getEntitiesByCondition(filterBy: any) {
        try {
            return await firstValueFrom(
                this.query.selectAll({
                    filterBy: filterBy
                })
            );
        } catch (error) {
            throw error;
        }
    }

    hasEntity(id: getIDType<S>): boolean {
        return this.query.hasEntity(id);
    }

    getEntityById(id: getIDType<S>): getEntityType<S> | undefined {
        const entity = this.query.getEntity(id);
        return entity ? { ...entity } as getEntityType<S> : undefined;
    }

    patchState(patchUpdate: Partial<S>) {
        this.update(patchUpdate);
    }

    getState(): S {
        return this.getValue();
    }

    isEmpty() {
        let entities = this.query.getValue().entities;
        if (entities) {
            return Object.keys(entities).length === 0;
        }
        return false;
    }
}