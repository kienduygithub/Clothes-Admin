import { Query, Store, StoreConfigOptions } from "@datorama/akita";

export class StateStoreCore<S> extends Store<S> {

    private query: Query<S>;
    private initialState: S;

    constructor(
        initialState: S, storeConfig?: Partial<StoreConfigOptions>
    ) {
        super(initialState, storeConfig);
        this.initialState = initialState;
        this.query = new Query<S>(this);
    }

    hasValueCache() {
        return this.query.getHasCache();
    }

    getValueStore() {
        return this.getValue();
    }

    setValueStore(newState: S) {
        this.update(newState);
    }

    resetValueStore() {
        this.update({ ...this.initialState });
    }

    getSelectStore() {
        return this.query.select(state => state);
    }

    getPartialSelectStore<K extends keyof S>(key: K) {
        return this.query.select(state => state[key]);
    }
}