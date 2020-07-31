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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
exports.ReduxRegister = void 0;
var redux_1 = require("redux");
var lazy_loader_1 = require("./lazy-loader");
var get_redux_saga_module_1 = require("./get-redux-saga-module");
var reducer_injector_1 = require("./reducer-injector");
var _1 = require(".");
/**
 * The ReduxRegister handles the connection of controllers, reducers, and sagas to Redux. Each ReduxRegister has its
 * own Redux store that it manages. The register will also setup the Redux-Saga middleware, if it finds the dependency.
 *
 * Middleware can be applied at construction. Sagas and reducers can be added at any time, as needed.
 */
var ReduxRegister = /** @class */ (function () {
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
    function ReduxRegister(config) {
        if (config === void 0) { config = {}; }
        this.registeredReducers = {};
        var _a = config.reducer, reducer = _a === void 0 ? null : _a, _b = config.initialState, initialState = _b === void 0 ? {} : _b, _c = config.middleware, middleware = _c === void 0 ? [] : _c, _d = config.sagaMiddleware, sagaMiddleware = _d === void 0 ? null : _d, _e = config.injector, injector = _e === void 0 ? new _1.ReducerInjector() : _e;
        this.injector = injector;
        this.injector.setGetObjectiveReduxReducers(this.getReducers.bind(this));
        lazy_loader_1.LazyLoader.addRegister(this, this.addControllerReducer.bind(this));
        var internalMiddleware = [];
        this.sagaMiddleware = this.setupSagaMiddleware(sagaMiddleware);
        /* istanbul ignore else */
        if (this.sagaMiddleware) {
            internalMiddleware[0] = redux_1.applyMiddleware(this.sagaMiddleware);
        }
        this.store = redux_1.createStore(reducer || reducer_injector_1.defaultReducer, initialState, redux_1.compose.apply(void 0, __spreadArrays(middleware, internalMiddleware)));
        this.storeFns = this.wrapStore();
        if (reducer) {
            this.replaceReducer(reducer);
        }
    }
    ReduxRegister.prototype.setupSagaMiddleware = function (sagaMiddleware) {
        var _a;
        var middleware = null;
        if (sagaMiddleware) {
            middleware = sagaMiddleware;
        }
        else {
            /* istanbul ignore next */
            middleware = (_a = get_redux_saga_module_1.getReduxSagaModule()) === null || _a === void 0 ? void 0 : _a.default();
        }
        return middleware;
    };
    /**
     * Monkey-patch the redux store so that the register can properly bind the store.
     *
     * @returns The original store methods.
     */
    ReduxRegister.prototype.wrapStore = function () {
        // Prevent the dispatch method from being re-bound
        var internalDispatch = this.dispatch.bind(this);
        this.dispatch = function (action) { return internalDispatch(action); };
        var store = this.store;
        var dispatch = store.dispatch, subscribe = store.subscribe, replaceReducer = store.replaceReducer, getState = store.getState, otherFns = __rest(store, ["dispatch", "subscribe", "replaceReducer", "getState"]);
        // Keep the original store functions for use later
        var storeFns = {
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
    };
    ReduxRegister.prototype.getReducers = function () {
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
     * const register = new ReduxRegister();
     * register.dispatch(myAction());
     * ```
     */
    ReduxRegister.prototype.dispatch = function (action) {
        var controller = lazy_loader_1.LazyLoader.getControllerForAction(action);
        if (controller) {
            controller.getInstance(this);
        }
        return this.storeFns.dispatch(action);
    };
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
    ReduxRegister.prototype.subscribe = function (listener) {
        return this.storeFns.subscribe(listener);
    };
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
    ReduxRegister.prototype.getState = function () {
        return this.storeFns.getState();
    };
    ReduxRegister.prototype.runSaga = function (sagaFn) {
        this.sagaMiddleware.run(sagaFn);
    };
    ReduxRegister.prototype.addControllerReducer = function (controller) {
        var name = controller.constructor.getStoreName();
        var namespace = controller.constructor.getNamespace();
        var placement = this.registeredReducers;
        if (namespace) {
            /* istanbul ignore else */
            if (placement[namespace] == null) {
                placement[namespace] = {};
            }
            placement = placement[namespace];
        }
        placement[name] = controller.reducer.bind(controller);
        this.storeFns.replaceReducer(this.injector.getReducerCreationFn()());
    };
    /**
     * Replaced the existing reducer with a new one.
     *
     * Note that, by design, this will not affect reducers generated by controllers. Controller reducers are
     * handled separately, which allows other injection mechanisms to use the register without trampling
     * the registers own lazy loading.
     *
     * @param nextReducer The new reducer that will replace the existing reducer.
     */
    ReduxRegister.prototype.replaceReducer = function (nextReducer) {
        this.storeFns.replaceReducer(nextReducer);
    };
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
    ReduxRegister.prototype.registerSaga = function (sagaFn) {
        this.runSaga(function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, get_redux_saga_module_1.getReduxSagaEffects().setContext({ register: this })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, sagaFn()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }.bind(this));
    };
    return ReduxRegister;
}());
exports.ReduxRegister = ReduxRegister;
