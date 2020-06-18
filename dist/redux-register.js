"use strict";
// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReduxRegister = void 0;
const redux_1 = require("redux");
const lazy_loader_1 = require("./lazy-loader");
const get_redux_saga_module_1 = require("./get-redux-saga-module");
/**
 * The ReduxRegister handles the connection of controllers, reducers, and sagas to Redux. Each ReduxRegister has its
 * own Redux store that it manages.
 *
 * Middleware can be applied at construction. Sagas and reducers can be added at any time, as needed.
 */
class ReduxRegister {
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
    constructor(middleware = []) {
        this.registeredReducers = {};
        this.registeredSagas = [];
        const internalMiddleware = [];
        const reduxSaga = get_redux_saga_module_1.getReduxSagaModule();
        /* istanbul ignore else */
        if (reduxSaga) {
            this.sagaMiddleware = reduxSaga.default({
                context: {
                    register: this,
                },
            });
            internalMiddleware[0] = this.sagaMiddleware;
        }
        this.store = redux_1.createStore(
        /* istanbul ignore next */
        () => { }, redux_1.applyMiddleware(...middleware, ...internalMiddleware));
    }
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
    dispatch(action) {
        const controller = lazy_loader_1.LazyLoader.getControllerForAction(action);
        if (controller) {
            controller.getInstance(this);
        }
        return this.store.dispatch(action);
    }
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
    subscribe(listener) {
        return this.store.subscribe(listener);
    }
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
    getState() {
        return this.store.getState();
    }
    updateReducers() {
        this.store.replaceReducer(redux_1.combineReducers(this.registeredReducers));
    }
    runSaga(sagaFn) {
        this.sagaMiddleware.run(sagaFn);
    }
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
    registerReducer(name, reducerFn) {
        this.registeredReducers[name] = reducerFn;
        this.updateReducers();
    }
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
    registerReducers(reducers) {
        this.registeredReducers = Object.assign(Object.assign({}, this.registeredReducers), reducers);
        this.updateReducers();
    }
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
    registerSaga(sagaFn) {
        this.registeredSagas.push(sagaFn);
        this.runSaga(sagaFn);
    }
}
exports.ReduxRegister = ReduxRegister;
//# sourceMappingURL=redux-register.js.map