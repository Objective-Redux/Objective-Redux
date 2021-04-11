import { Middleware, AnyAction, Unsubscribe } from 'redux';
import { Action } from '../helpers/action';
import { StatelessController } from '../controllers/stateless-controller';
import { ReducerInjector } from './reducer-injector';
/**
 * @internal
 */
declare type Reducer<S, A> = (prevState: S, action: A) => S;
/**
 * @internal
 */
export declare type PreDispatchHookFn = (action: AnyAction) => any;
interface ObjectiveStoreOptions {
    /**
     * The initial reducer for the store.
     */
    reducer?: Reducer<any, AnyAction>;
    /**
     * The initial state to which the store should be initialized.
     */
    initialState?: any;
    /**
     * Middleware that should be applied to the store. This should not include saga middleware.
     */
    middleware?: Middleware<any>[];
    /**
     * The context that should be given to sagas.
     */
    sagaContext?: any;
    /**
     * An injector object for adding reducers and sagas to the store.
     */
    injector?: ReducerInjector;
    /**
     * A function that will be called before actions are dispatched.
     * The function should take an action and return either null or a promise. If a promise is returned, the action will
     * be dispatched when the promise resolves.
     */
    preDispatchHook?: PreDispatchHookFn;
    /**
     * A function used to compose the Redux middleware.
     */
    composeMiddlewareFn?: any;
}
/**
 * @internal
 */
export interface SagaFn<Payload = void> {
    (action: Action<Payload>): any;
}
/**
 * The ObjectiveStore handles the connection of controllers, reducers, and sagas to Redux. Each ObjectiveStore has its
 * own Redux store that it manages. The store will also setup the Redux-Saga middleware, if it finds the dependency.
 *
 * Middleware can be applied at construction. Sagas and reducers can be added at any time, as needed.
 */
export declare class ObjectiveStore {
    private readonly store;
    private readonly sagaMiddleware;
    private readonly injector;
    private readonly registeredReducers;
    private readonly registeredSagas;
    /**
     * Creates an instance of the ObjectiveStore.
     *
     * In setting up the instance, the class will create a ReduxStore. If Redux-Saga is available, tbe middleware will be
     * setup automatically as well.
     *
     * @param config The optional configuration for the controller.
     * @param config.reducer The initial reducer for the store.
     * @param config.initialState The initial state of the reducers.
     * @param config.middleware Middle to be added to the Redux store. This should not include the saga middleware.
     * @param config.sagaContext The context to be used when creating the Saga middleware.
     * @param config.injector An instance of the ReducerInjector class.
     * @param config.preDispatchHook A function that takes an action and returns a promise.
     * @returns An instance of the ObjectiveStore.
     * @example
     * ```typescript
     * // No need to setup the Redux-Saga middleware-- Objective-Redux will handle it.
     * const objectiveStore = new ObjectiveStore();
     * ```
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
    constructor(config?: ObjectiveStoreOptions);
    /**
     * Monkey-patch the redux store so that the objective store can properly bind the Redux store.
     *
     * @returns The original store methods.
     */
    private wrapStore;
    private getReducers;
    /**
     * Dispatches a Redux action to the store without using a Controller.
     *
     * @param action The action that is to be dispatched via the store.
     * @returns The action that was sent.
     * @example
     * ```typescript
     * const objectiveStore = new ObjectiveStore();
     * objectiveStore.dispatch(myAction());
     * ```
     */
    dispatch(action: AnyAction): AnyAction;
    /**
     * Subscribes to the Redux store events.
     *
     * @param listener The callback that will be fired.
     * @returns An unsubscribe function that can be called to stop listening.
     * @example
     * ```
     * const objectiveStore = new ObjectiveStore();
     * const unsubscribeFn = objectiveStore.subscribe(myCallback);
     * ```
     */
    subscribe(listener: () => void): Unsubscribe;
    /**
     * Gets the state object from the Redux store.
     *
     * @returns The state object from Redux.
     * @example
     * ```
     * const objectiveStore = new ObjectiveStore();
     * const state = objectiveStore.getState();
     * ```
     */
    getState(): any;
    private addControllerReducer;
    private removeControllerReducer;
    private useControllerReducer;
    private cancelSagasForController;
    /**
     * Replaced the existing reducer with a new one.
     *
     * THIS METHOD SHOULD NOT BE USED DIRECTLY. Use the ReducerInjector class, instead.
     *
     * @param nextReducer The new reducer that will replace the existing reducer.
     */
    replaceReducer(nextReducer: Reducer<any, AnyAction>): void;
    /**
     * Adds and and begins running a saga as part in the context of the store that the store manages.
     *
     * Note: This method should not be called manually for StatelessControllers! The controller will handle this call on
     * its own when the controller is first initialized.
     *
     * @param sagaFn The saga to add to the store.
     * @param statelessController The StatelessController from which the saga is originating, or null if it does not come
     * from a StatelessController.
     * @example
     * ```typescript
     * function* sagaFn() {
     *   yield console.log('Hello, world!');
     * }
     *
     * const objectiveStore = new ObjectiveStore();
     * objectiveStore.registerSaga(sagaFn);
     * ```
     */
    registerSaga(sagaFn: SagaFn<void>, statelessController?: StatelessController | null): void;
}
export {};
//# sourceMappingURL=objective-store.d.ts.map