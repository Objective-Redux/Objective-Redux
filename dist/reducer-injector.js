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
exports.ReducerInjector = exports.defaultReducer = void 0;
const redux_1 = require("redux");
/**
 * @internal
 */
/* istanbul ignore next */
exports.defaultReducer = () => ({});
/**
 * An object that handles injection of reducers into the Redux store that is managed by a ReduxRegister.
 *
 * This can be used when middleware or another part of the application also needs to handle injection. For example,
 * this should be used when Redux-Injectors is being used with Objective-Redux.
 *
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
class ReducerInjector {
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
    constructor(initialReducers = {}) {
        this.initialReducers = initialReducers;
        this.getObjectiveReduxReducers = null;
        this.injectedReducers = {};
    }
    ;
    /**
     * This function should not be called directly.
     *
     * Sets the get function for retrieving the reducers internal to Objective-Redux.
     *
     * @param getObjectiveReduxReducers Function that can be called to get the reducers internal to Objective-Redux.
     * This only be used by the ReduxRegister and should not be called directly.
     *
     * @example
     * ```typescript
     * // Do not use this function directly!
     * ```
     */
    setGetObjectiveReduxReducers(getObjectiveReduxReducers) {
        this.getObjectiveReduxReducers = getObjectiveReduxReducers;
    }
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
     * const register = new ReduxRegister({
     *   injector,
     * });
     *
     * const nextReducer = reducerCreationFn({
     *   MyInitialReducer: reducerTwo,
     * });
     *
     * register.replaceReducer(nextReducer);
     * ```
     */
    getReducerCreationFn() {
        return (injectedReducers = this.injectedReducers) => {
            this.injectedReducers = injectedReducers;
            const reducers = Object.assign(Object.assign(Object.assign({}, this.initialReducers), this.injectedReducers), (this.getObjectiveReduxReducers && this.getObjectiveReduxReducers()));
            return Object.keys(reducers).length > 0
                ? redux_1.combineReducers(reducers)
                : exports.defaultReducer;
        };
    }
}
exports.ReducerInjector = ReducerInjector;
