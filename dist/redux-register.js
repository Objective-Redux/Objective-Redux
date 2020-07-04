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
 * @internal
 */
/* istanbul ignore next */
const defaultReducer = () => ({});
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
     * @param reducer The initial reducer for the store. This should not include any of the reducers for the controllers.
     * @param initialState The initial state of the store. This should not include the state for any of the controllers.
     * @param middleware Additional middleware to add to the store.
     * @returns An instance of the ReduxRegister.
     * @example
     * ```typescript
     * const register = new ReduxRegister();
     * ```
     */
    // eslint-disable-next-line max-params
    constructor(reducer = null, initialState = {}, middleware = []) {
        this.registeredReducers = {};
        this.replacedReducer = null;
        this.registeredSagas = [];
        lazy_loader_1.LazyLoader.addRegister(this, this.addControllerReducer.bind(this));
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
        this.store = redux_1.createStore(defaultReducer, initialState, redux_1.applyMiddleware(...middleware, ...internalMiddleware));
        this.storeFns = this.wrapStore();
        if (reducer) {
            this.replaceReducer(reducer);
        }
    }
    /**
     * Monkey-patch the redux store so that the register can properly partition the store for internal and external use.
     *
     * @returns The original store methods.
     */
    wrapStore() {
        // Prevent the dispatch method from being re-bound
        const internalDispatch = this.dispatch.bind(this);
        this.dispatch = (action) => internalDispatch(action);
        const { store } = this;
        // Keep the original store functions for use later
        const storeFns = {
            dispatch: store.dispatch.bind(this.store),
            subscribe: store.subscribe.bind(this.store),
            replaceReducer: store.replaceReducer.bind(this.store),
            getState: store.getState.bind(this.store),
        };
        // Map the store functions to register functions
        store.dispatch = this.dispatch.bind(this);
        store.subscribe = this.subscribe.bind(this);
        store.replaceReducer = this.replaceReducer.bind(this);
        store.getState = this.getState.bind(this);
        return storeFns;
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
        return this.storeFns.dispatch(action);
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
        return this.storeFns.subscribe(listener);
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
        const { external, internal } = this.storeFns.getState();
        return Object.assign(Object.assign({}, external), internal);
    }
    updateReducers() {
        const external = this.replacedReducer || defaultReducer;
        const internal = redux_1.combineReducers(this.registeredReducers);
        this.storeFns.replaceReducer(redux_1.combineReducers({
            external,
            internal,
        }));
    }
    runSaga(sagaFn) {
        this.sagaMiddleware.run(sagaFn);
    }
    addControllerReducer(controller) {
        this.registeredReducers[controller.constructor.getName()] = controller.reducer.bind(controller);
        this.updateReducers();
    }
    /**
     * Replaced the existing reducer with a new one.
     *
     * Note that, by design, this will not affect reducers generated by controllers. Controller reducers are
     * handled separately, which allows other injection mechanisms to use the register without trampling
     * the registers own lazy loading.
     *
     * @param nextReducer The new reducer that will replace the existing reducer.
     */
    replaceReducer(nextReducer) {
        this.replacedReducer = nextReducer;
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
