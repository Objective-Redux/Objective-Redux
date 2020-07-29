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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReduxRegister = void 0;
const redux_1 = require("redux");
const lazy_loader_1 = require("./lazy-loader");
const get_redux_saga_module_1 = require("./get-redux-saga-module");
const reducer_injector_1 = require("./reducer-injector");
const _1 = require(".");
/**
 * The ReduxRegister handles the connection of controllers, reducers, and sagas to Redux. Each ReduxRegister has its
 * own Redux store that it manages. The register will also setup the Redux-Saga middleware, if it finds the dependency.
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
     * @param config The optional configuration for the controller.
     * @param config.reducer The initial reducer for the store.
     * @param config.initialState The initial state of the reducers.
     * @param config.middleware Middle to be added to the Redux store. This should not include the saga middleware.
     * @param config.sagaMiddleware The saga middleware, if you do not want Objective-Redux to create it for you.
     * @param config.injector An instance of the ReducerInjector class.
     * @returns An instance of the ReduxRegister.
     * @example
     * ```typescript
     * // No need to setup the Redux-Saga middleware-- Objective-Redux will handle it.
     * const register = new ReduxRegister();
     * ```
     * @example
     * ```typescript
     * import { ReducerInjector, ReduxRegister } from 'objective-redux';
     * import { createInjectorsEnhancer } from 'redux-injectors';
     * import createSagaMiddleware from 'redux-saga';
     * import { initialState, initialReducers } from './elsewhere';
     *
     * const injector = new ReducerInjector(initialReducers);
     * const sagaMiddleware = createSagaMiddleware();
     *
     * const createReducer = injector.getReducerCreationFn();
     * const runSaga = sagaMiddleware.run;
     *
     * const middleware = [
     *   createInjectorsEnhancer({ createReducer, runSaga }),
     * ];
     *
     * const register = new ReduxRegister({
     *   reducer,
     *   initialState,
     *   middleware,
     *   injector,
     *   sagaMiddleware,
     * });
     * ```
     */
    constructor(config = {}) {
        this.registeredReducers = {};
        const { reducer = null, initialState = {}, middleware = [], sagaMiddleware = null, injector = new _1.ReducerInjector(), } = config;
        this.injector = injector;
        this.injector.setGetObjectiveReduxReducers(() => this.registeredReducers);
        lazy_loader_1.LazyLoader.addRegister(this, this.addControllerReducer.bind(this));
        const internalMiddleware = [];
        this.sagaMiddleware = this.setupSagaMiddleware(sagaMiddleware);
        /* istanbul ignore else */
        if (this.sagaMiddleware) {
            internalMiddleware[0] = redux_1.applyMiddleware(this.sagaMiddleware);
        }
        this.store = redux_1.createStore(reducer || reducer_injector_1.defaultReducer, initialState, redux_1.compose(...middleware, ...internalMiddleware));
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
            /* istanbul ignore next */
            middleware = (_a = get_redux_saga_module_1.getReduxSagaModule()) === null || _a === void 0 ? void 0 : _a.default();
        }
        return middleware;
    }
    /**
     * Monkey-patch the redux store so that the register can properly bind the store.
     *
     * @returns The original store methods.
     */
    wrapStore() {
        // Prevent the dispatch method from being re-bound
        const internalDispatch = this.dispatch.bind(this);
        this.dispatch = (action) => internalDispatch(action);
        const { store } = this;
        const { dispatch, subscribe, replaceReducer, getState } = store, otherFns = __rest(store, ["dispatch", "subscribe", "replaceReducer", "getState"]);
        // Keep the original store functions for use later
        const storeFns = {
            dispatch: dispatch.bind(this.store),
            subscribe: subscribe.bind(this.store),
            replaceReducer: replaceReducer.bind(this.store),
            getState: getState.bind(this.store),
        };
        Object.assign(this, otherFns);
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
        return this.storeFns.getState();
    }
    runSaga(sagaFn) {
        this.sagaMiddleware.run(sagaFn);
    }
    addControllerReducer(controller) {
        this.registeredReducers[controller.constructor.getName()] = controller.reducer.bind(controller);
        this.storeFns.replaceReducer(this.injector.getReducerCreationFn()());
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
        this.storeFns.replaceReducer(nextReducer);
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
