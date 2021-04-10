"use strict";
// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2021 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectiveStore = void 0;
var redux_1 = require("redux");
var get_redux_saga_module_1 = require("../helpers/get-redux-saga-module");
var lazy_loader_1 = require("./lazy-loader");
var reducer_injector_1 = require("./reducer-injector");
var lazy_loading_middleware_1 = require("./lazy-loading-middleware");
var pre_dispatch_hook_middleware_1 = require("./pre-dispatch-hook-middleware");
/* istanbul ignore next */
// eslint-disable-next-line jsdoc/require-description, jsdoc/require-returns
/**
 * @internal
 */
var defaultPreDispatchHook = function () { return null; };
/**
 * The ObjectiveStore handles the connection of controllers, reducers, and sagas to Redux. Each ObjectiveStore has its
 * own Redux store that it manages. The store will also setup the Redux-Saga middleware, if it finds the dependency.
 *
 * Middleware can be applied at construction. Sagas and reducers can be added at any time, as needed.
 */
var ObjectiveStore = /** @class */ (function () {
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
    // eslint-disable-next-line max-statements
    function ObjectiveStore(config) {
        if (config === void 0) { config = {}; }
        this.registeredReducers = {};
        this.registeredSagas = {};
        var _a = config.reducer, reducer = _a === void 0 ? null : _a, _b = config.initialState, initialState = _b === void 0 ? {} : _b, _c = config.middleware, middleware = _c === void 0 ? [] : _c, _d = config.sagaContext, sagaContext = _d === void 0 ? null : _d, _e = config.injector, injector = _e === void 0 ? new reducer_injector_1.ReducerInjector() : _e, _f = config.preDispatchHook, preDispatchHook = _f === void 0 ? defaultPreDispatchHook : _f, _g = config.composeMiddlewareFn, composeMiddlewareFn = _g === void 0 ? redux_1.compose : _g;
        lazy_loader_1.LazyLoader.addObjectiveStore(this, {
            registerReducerFn: this.addControllerReducer.bind(this),
            unregisterReducerFn: this.removeControllerReducer.bind(this),
            cancelSagasForController: this.cancelSagasForController.bind(this),
        });
        var reduxSaga = get_redux_saga_module_1.getReduxSagaModule();
        var internalMiddleware = [
            pre_dispatch_hook_middleware_1.preDispatchHookMiddleware(preDispatchHook),
            lazy_loading_middleware_1.lazyLoadingMiddleware(this),
        ];
        this.injector = injector;
        this.injector.setGetObjectiveReduxReducers(this.getReducers.bind(this));
        /* istanbul ignore else */
        if (reduxSaga) {
            var objectiveStore = this;
            this.sagaMiddleware = reduxSaga.default({
                context: __assign(__assign({}, sagaContext), { objectiveStore: objectiveStore }),
            });
            internalMiddleware.push(this.sagaMiddleware);
            this.injector.setSagaRunningFn(this.sagaMiddleware.run);
        }
        this.store = redux_1.createStore(reducer || reducer_injector_1.defaultReducer, initialState, composeMiddlewareFn.apply(void 0, __spreadArrays(middleware, [redux_1.applyMiddleware.apply(void 0, internalMiddleware)])));
        this.wrapStore();
        if (reducer) {
            this.replaceReducer(reducer);
        }
    }
    /**
     * Monkey-patch the redux store so that the objective store can properly bind the Redux store.
     *
     * @returns The original store methods.
     */
    ObjectiveStore.prototype.wrapStore = function () {
        var _this = this;
        [
            'dispatch',
            'subscribe',
            'replaceReducer',
            'getState',
        ].forEach(function (fn) {
            var internalFn = _this[fn].bind(_this);
            _this[fn] = function () {
                var params = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    params[_i] = arguments[_i];
                }
                return internalFn.apply(void 0, params);
            };
        });
        var _a = this.store, 
        /* eslint-disable @typescript-eslint/no-unused-vars */
        dispatch = _a.dispatch, subscribe = _a.subscribe, replaceReducer = _a.replaceReducer, getState = _a.getState, 
        /* eslint-enable @typescript-eslint/no-unused-vars */
        otherFns = __rest(_a, ["dispatch", "subscribe", "replaceReducer", "getState"]);
        Object.assign(this, otherFns);
    };
    ObjectiveStore.prototype.getReducers = function () {
        var _this = this;
        var reducerMap = {};
        Object.keys(this.registeredReducers).forEach(function (key) {
            var reducer = _this.registeredReducers[key];
            if (typeof reducer == 'object') {
                reducer = redux_1.combineReducers(reducer);
            }
            reducerMap[key] = reducer;
        });
        return reducerMap;
    };
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
    ObjectiveStore.prototype.dispatch = function (action) {
        return this.store.dispatch(action);
    };
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
    ObjectiveStore.prototype.subscribe = function (listener) {
        return this.store.subscribe(listener);
    };
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
    ObjectiveStore.prototype.getState = function () {
        return this.store.getState();
    };
    ObjectiveStore.prototype.addControllerReducer = function (controller) {
        this.useControllerReducer(controller);
    };
    ObjectiveStore.prototype.removeControllerReducer = function (controller) {
        this.useControllerReducer(controller, true);
    };
    // eslint-disable-next-line max-statements
    ObjectiveStore.prototype.useControllerReducer = function (controller, remove) {
        if (remove === void 0) { remove = false; }
        var name = controller.constructor.getName();
        var namespace = controller.constructor.getNamespace();
        var placement = this.registeredReducers;
        if (namespace) {
            /* istanbul ignore else */
            if (placement[namespace] == null) {
                placement[namespace] = {};
            }
            placement = placement[namespace];
        }
        if (remove) {
            if (namespace) {
                delete this.registeredReducers[namespace];
            }
            else {
                delete placement[name];
            }
        }
        else {
            placement[name] = controller.reducer.bind(controller);
        }
        this.store.replaceReducer(this.injector.getReducerCreationFn()());
    };
    ObjectiveStore.prototype.cancelSagasForController = function (statelessController) {
        var name = statelessController.constructor.getName();
        var namespace = statelessController.constructor.getNamespace() || '';
        var placement = this.registeredSagas[namespace] || {};
        (placement[name] || []).forEach(function (task) {
            task.cancel();
        });
        delete placement[name];
    };
    /**
     * Replaced the existing reducer with a new one.
     *
     * Note that, by design, this will not affect reducers generated by controllers. Controller reducers are
     * handled separately, which allows other injection mechanisms to use the store without trampling
     * the registers own lazy loading.
     *
     * @param nextReducer The new reducer that will replace the existing reducer.
     */
    ObjectiveStore.prototype.replaceReducer = function (nextReducer) {
        this.store.replaceReducer(nextReducer);
    };
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
    // eslint-disable-next-line max-statements
    ObjectiveStore.prototype.registerSaga = function (sagaFn, statelessController) {
        if (statelessController === void 0) { statelessController = null; }
        var task = this.sagaMiddleware.run(sagaFn);
        if (!statelessController) {
            return;
        }
        var name = statelessController.constructor.getName();
        var namespace = statelessController.constructor.getNamespace() || '';
        var placement = this.registeredSagas;
        /* istanbul ignore else */
        if (placement[namespace] == null) {
            placement[namespace] = {};
        }
        placement = placement[namespace];
        /* istanbul ignore else */
        if (placement[name] == null) {
            placement[name] = [];
        }
        placement[name].push(task);
    };
    return ObjectiveStore;
}());
exports.ObjectiveStore = ObjectiveStore;
