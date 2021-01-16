import { Reducer } from 'redux';
import { SagaFn } from './objective-store';
/**
 * @internal
 */
export declare const defaultReducer: () => any;
/**
 * @internal
 */
interface CreateReducerFn {
    (injectedReducer?: Record<string, any>): any;
}
interface RunSagaFn {
    (saga: SagaFn<void>): void;
}
/**
 * An object that handles injection of reducers into the Redux store that is managed by an ObjectiveStore.
 *
 * This can be used when middleware or another part of the application also needs to handle injection. For example,
 * this should be used when Redux-Injectors is being used with Objective-Redux.
 *
 * @example
 * ```typescript
 * import { ReducerInjector, ObjectiveStore } from 'objective-redux';
 * import { createInjectorsEnhancer } from 'redux-injectors';
 * import { initialState, initialReducers } from './elsewhere';
 *
 * const injector = new ReducerInjector(initialReducers);
 *
 * const createReducer = injector.getReducerCreationFn();
 * const runSaga = injector.getRunSagaFn();
 *
 * const middleware = [
 *   createInjectorsEnhancer({ createReducer, runSaga }),
 * ];
 *
 * const objectiveStore = new ObjectiveStore({
 *   reducer,
 *   initialState,
 *   middleware,
 *   injector,
 * });
 * ```
 */
export declare class ReducerInjector {
    private readonly initialReducers;
    private injectedReducers;
    private sagaRunningFn;
    private getObjectiveReduxReducers;
    /**
     * Creates an injector instance.
     *
     * @param initialReducers The initial reducers to add to the combine reducer.
     * @example
     * ```typescript
     * const injector = new ReducerInjector({
     *   MyReducer: reducerOne,
     * });
     * ```
     */
    constructor(initialReducers?: Record<string, any>);
    /**
     * This function should not be called directly.
     *
     * Sets the get function for retrieving the reducers internal to Objective-Redux.
     *
     * @param getObjectiveReduxReducers Function that can be called to get the reducers internal to Objective-Redux.
     * This only be used by the ObjectiveStore and should not be called directly.
     *
     * @example
     * ```typescript
     * // Do not use this function directly!
     * ```
     */
    setGetObjectiveReduxReducers(getObjectiveReduxReducers: () => Record<string, Reducer>): void;
    /**
     * This function should not be called directly.
     *
     * Sets the get function for running a Saga.
     *
     * @param sagaRunningFn Function used to run a saga.
     *
     * @example
     * ```typescript
     * // Do not use this function directly!
     * ```
     */
    setSagaRunningFn(sagaRunningFn: any): void;
    /**
     * A function that can be used to get add additional reducers to the store.
     *
     * @returns A function that takes a map of reducers. The reducers are added to the initial reducers and the reducers
     * internal to Objective-Redux, resulting in a final, combined reducer.
     *
     * @example
     * ```typescript
     * const initialReducers = {
     *   MyInitialReducer: reducerOne,
     * };
     *
     * const injector = new ReducerInjector(initialReducers);
     * const reducerCreationFn = injector.getReducerCreationFn();
     *
     * const objectiveStore = new ObjectiveStore({
     *   injector,
     * });
     *
     * const nextReducer = reducerCreationFn({
     *   MyInitialReducer: reducerTwo,
     * });
     *
     * objectiveStore.replaceReducer(nextReducer);
     * ```
     */
    getReducerCreationFn(): CreateReducerFn;
    getSagaRunningFn(): RunSagaFn;
}
export {};
//# sourceMappingURL=reducer-injector.d.ts.map