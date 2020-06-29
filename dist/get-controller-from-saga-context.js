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
exports.getControllerFromSagaContext = void 0;
const get_register_from_saga_context_1 = require("./get-register-from-saga-context");
/**
 * Gets a controller instance from the saga context.
 *
 * @template C The type of controller that will be returned. This type is inferred and does not need to be specified in
 * TypeScript.
 * @param controller The controller class of which an instance should be retrieved.
 * @returns A generator that yields an instance of the provided controller or null if there is no register in the saga's
 * context.
 *
 * @example
 * ```typescript
 * // Also works with a StateController
 * class MyController extends StatelessController {
 *   // ...
 * }
 *
 * function* foo(): any {
 *   const myController = yield getControllerFromSagaContext(MyController);
 * }
 * ```
 */
function* getControllerFromSagaContext(controller) {
    const register = yield get_register_from_saga_context_1.getRegisterFromSagaContext();
    if (!register) {
        return null;
    }
    return yield controller.getInstance(register);
}
exports.getControllerFromSagaContext = getControllerFromSagaContext;
//# sourceMappingURL=get-controller-from-saga-context.js.map