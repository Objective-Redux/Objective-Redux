import { Middleware, AnyAction, Unsubscribe } from 'redux';
/**
 * @internal
 */
declare type Reducer<S, A> = (prevState: S, action: A) => S;
/**
 * @internal
 */
interface ReducerMap {
    [reducer: string]: Reducer<any, any>;
}
/**
 * @internal
 */
export interface SagaFn<Payload> {
    (payload: Payload): any;
}
/**
 * The ReduxRegister handles the connection of controllers, reducers, and sagas to Redux. Each ReduxRegister has its
 * own Redux store that it manages.
 *
 * Middleware can be applied at construction. Sagas and reducers can be added at any time, as needed.
 */
export declare class ReduxRegister {
    private readonly store;
    private readonly sagaMiddleware;
    private registeredReducers;
    private readonly registeredSagas;
    /**
     * Creates an instance of the ReduxRegister.
     *
     * In setting up the instance, the class will create a ReduxStore.
     *
     * @param middleware Additional middleware to add.
     * @returns An instance of the ReduxRegister.
     * @example
     * ```typescript
     * const register = new ReduxRegister();
     * ```
     */
    constructor(middleware?: Middleware<any>[]);
    /**
     * Dispatches a Redux action to the store without using a Controller.
     *
     * @param action The action that is to be dispatched via the store.
     * @returns The action that was sent.
     * @example
     * ```typescript
     * const register = new ReduxRegister();
     * register.dispatch(myAction());
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
     * const register = new ReduxRegister();
     * const unsubscribeFn = register.subscribe(myCallback);
     * ```
     */
    subscribe(listener: () => void): Unsubscribe;
    /**
     * Gets the state object from the Redux store.
     *
     * @returns The state object from Redux.
     * @example
     * ```
     * const register = new ReduxRegister();
     * const state = register.getState();
     * ```
     */
    getState(): any;
    private updateReducers;
    private runSaga;
    /**
     * Adds a reducer to the register's Redux store.
     *
     * @param name The name of the reducer/the name of the state slice.
     * @param reducerFn The reducer that is being registered.
     * @example
     * ```typescript
     * const reducer = (state = { isOn: false }, action) {
     *   switch (action.type) {
     *     case 'MY_ACTION':
     *       return {
     *         ...state,
     *         isOn: !state.isOn,
     *       };
     *     default:
     *       return state;
     *   }
     * };
     *
     * const register = new ReduxRegister();
     * register.registerReducer('switch', reducer);
     * ```
     */
    registerReducer(name: string, reducerFn: Reducer<any, any>): void;
    /**
     * Adds multiple reducers to the store.
     *
     * This can be especially helpful when migrating from pure Redux, to add Reducers before they are migrated to
     * [[StateController|StateControllers]].
     *
     * @param reducers A map of slice names to their reducing functions.
     * @example
     * ```typescript
     * const register = new ReduxRegister();
     * register.registerReducers({
     *   sliceOne: reducerOne,
     *   sliceTwo: reducerTwo,
     * });
     * ```
     */
    registerReducers(reducers: ReducerMap): void;
    /**
     * Adds and and begins running a saga as part in the context of the store that the register manages.
     *
     * @param sagaFn The saga to add to the register.
     * @example
     * ```typescript
     * function* sagaFn() {
     *   yield console.log('Hello, world!');
     * }
     *
     * const register = new ReduxRegister();
     * register.registerSaga(sagaFn);
     * ```
     */
    registerSaga(sagaFn: SagaFn<void>): void;
}
export {};
//# sourceMappingURL=redux-register.d.ts.map