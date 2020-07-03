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
exports.Controller = void 0;
const lazy_loader_1 = require("./lazy-loader");
const controllernamenotdefined_1 = require("./controllernamenotdefined");
const _1 = require("./");
/**
 * @internal
 */
class Controller {
    constructor(register) {
        this.count = 0;
        this.register = register;
    }
    /**
     * Gets the name of the state slice.
     *
     * If the controller will be used with lazy loading, the name of the controller must be globally unique.
     *
     * @returns The name of the state slice.
     */
    static getName() {
        throw new controllernamenotdefined_1.ControllerNameNotDefined('No name was defined for this controller');
    }
    /**
     * Generates a unique, default action name.
     *
     * @param name The name of the action or null to generate a unique, default action name.
     * @returns An action name.
     */
    createActionName(name = null) {
        const actionName = name || `${this.count++}`;
        const controllerName = this.constructor.getName();
        return _1.getActionNameForController(controllerName, actionName);
    }
    /**
     * Gets an instance of the class, creating one if it does not yet exist.
     *
     * This should be used as the method of instantiating controllers.
     *
     * @template T the controller type. Will be inferred from the class instance and does not need to be provided.
     * @param this Implicit "this" for internal use. When calling, this parameter should be ignored/skipped.
     * @param register An instance of the ReduxRegister from which to get the controller.
     * @returns An instance of the controller.
     *
     * @example
     * ```typescript
     * const instance = MyController.getInstance(register);
     * ```
     */
    static getInstance(register) {
        return lazy_loader_1.LazyLoader.getController(register, this);
    }
    /**
     * Allows the controller to be lazy loaded by actions triggered outside of Objective-Redux.
     *
     * This can be used in conjunction with the method [[withAddressableName]].
     *
     * @param this Implicit "this" parameter, which does not need to be supplied.
     * @example
     * ```typescript
     * class MyController extends StateController<MySliceType> {
     *   // ...
     * }
     *
     * MyController.lazyLoadOnExternalAction();
     *
     * export MyController;
     * ```
     */
    static lazyLoadOnExternalAction() {
        lazy_loader_1.LazyLoader.registerController(this);
    }
}
exports.Controller = Controller;
//# sourceMappingURL=controller.js.map