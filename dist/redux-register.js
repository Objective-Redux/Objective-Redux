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
 * own Redux store that it manages. The register will also setup the Redux-Saga middleware, if it finds the dependency.
 *
 * The store is partitioned internally, making it safe to continue calling functions like replaceReducer without
 * affecting how Objective-Redux manages its own reducers.
 *
 * Middleware can be applied at construction. Sagas and reducers can be added at any time, as needed.
 */
class ReduxRegister {
    /**
     * Creates an instance of the ReduxRegister.
     *
     * In setting up the instance, the class will create a ReduxStore. If Redux-Saga is available, tbe middleware will be
     * setup automatically as well.
     *
     * @param reducer The initial reducer for the store. This should not include any of the reducers for the controllers.
     * @param initialState The initial state of the store. This should not include the state for any of the controllers.
     * @param middleware Additional middleware to add to the store.
     * @param sagaMiddleware The saga middleware to use, if you do not want Objective-Redux to create it for you.
     * @returns An instance of the ReduxRegister.
     * @example
     * ```typescript
     * // No need to setup the Redux-Saga middleware-- Objective-Redux will handle it.
     * const register = new ReduxRegister();
     * ```
     */
    // eslint-disable-next-line max-params
    constructor(reducer = null, initialState = {}, middleware = [], sagaMiddleware = null) {
        this.registeredReducers = {};
        this.replacedReducer = null;
        lazy_loader_1.LazyLoader.addRegister(this, this.addControllerReducer.bind(this));
        const internalMiddleware = [];
        this.sagaMiddleware = this.setupSagaMiddleware(sagaMiddleware);
        if (this.sagaMiddleware) {
            internalMiddleware[0] = this.sagaMiddleware;
        }
        this.store = redux_1.createStore(defaultReducer, initialState, redux_1.applyMiddleware(...middleware, ...internalMiddleware));
        this.storeFns = this.wrapStore();
        if (reducer) {
            this.replaceReducer(reducer);
        }
    }
    setupSagaMiddleware(sagaMiddleware) {
        var _a;
        let middleware = null;
        if (sagaMiddleware) {
            middleware = sagaMiddleware;
        }
        else {
            middleware = (_a = get_redux_saga_module_1.getReduxSagaModule()) === null || _a === void 0 ? void 0 : _a.default();
        }
        return middleware;
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
        this.runSaga(function* () {
            yield get_redux_saga_module_1.getReduxSagaEffects().setContext({ register: this });
            yield sagaFn();
        }.bind(this));
    }
}
exports.ReduxRegister = ReduxRegister;
