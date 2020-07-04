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
exports.configureDebounce = exports.configureTakeLeading = exports.configureTakeEvery = exports.configureTakeLatest = void 0;
const get_redux_saga_module_1 = require("./get-redux-saga-module");
/**
 * Returns a function that will create a takeLatest saga watcher. This can be used with the SagaBuilder::withTake()
 * method.
 *
 * @returns A function that creates a takeLatest watching function.
 * @example
 * ```typescript
 * configureTakeLatest();
 * ```
 */
function configureTakeLatest() {
    const effects = get_redux_saga_module_1.getReduxSagaEffects();
    return (config) => function* () {
        yield effects.takeLatest(config.name, config.sagaFn);
    };
}
exports.configureTakeLatest = configureTakeLatest;
/**
 * Returns a function that will create a takeEvery saga watcher. This can be used with the SagaBuilder::withTake()
 * method.
 *
 * @returns A function that creates a takeEvery watching function.
 * @example
 * ```typescript
 * configureTakeEvery();
 * ```
 */
function configureTakeEvery() {
    const effects = get_redux_saga_module_1.getReduxSagaEffects();
    return (config) => function* () {
        yield effects.takeEvery(config.name, config.sagaFn);
    };
}
exports.configureTakeEvery = configureTakeEvery;
/**
 * Returns a function that will create a takeLeading saga watcher. This can be used with the SagaBuilder::withTake()
 * method.
 *
 * @returns A function that creates a takeLeading watching function.
 * @example
 * ```typescript
 * configureTakeLeading();
 * ```
 */
function configureTakeLeading() {
    const effects = get_redux_saga_module_1.getReduxSagaEffects();
    return (config) => function* () {
        yield effects.takeLeading(config.name, config.sagaFn);
    };
}
exports.configureTakeLeading = configureTakeLeading;
/**
 * Returns a function that will create a debounce saga watcher. This can be used with the SagaBuilder::withTake()
 * method.
 *
 * @param debounceConfig The configuration for the watcher.
 * @returns A function that creates a debounce watching function.
 * @example
 * ```typescript
 * configureDebounce({ debounceTime: 1000 });
 * ```
 */
function configureDebounce(debounceConfig) {
    const effects = get_redux_saga_module_1.getReduxSagaEffects();
    return (config) => function* () {
        yield effects.debounce((debounceConfig === null || debounceConfig === void 0 ? void 0 : debounceConfig.debounceTime) || 0, config.name, config.sagaFn);
    };
}
exports.configureDebounce = configureDebounce;
// export function configureTake(): TakeBuilder {
//   //
// }
