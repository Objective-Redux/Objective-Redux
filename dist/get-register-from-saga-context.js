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
exports.getRegisterFromSagaContext = void 0;
const get_redux_saga_module_1 = require("./get-redux-saga-module");
/**
 * Gets the register from the saga's context.
 *
 * @example
 * ```typescript
 * function* () {
 *   const register = yield getRegisterFromSagaContext();
 * }
 * ```
 * @returns A generator that yields an instance of the ReduxRegister.
 */
function* getRegisterFromSagaContext() {
    return yield get_redux_saga_module_1.getReduxSagaEffects().getContext('register');
}
exports.getRegisterFromSagaContext = getRegisterFromSagaContext;
