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
     * This must be overloaded and defined for each controller. Failure to override the controller will result
     * in ControllerNameNotDefined errors.
     *
     * The name of the controller should be globally unique for all Objective-Redux controllers in the application.
     *
     * @throws {ControllerNameNotDefined} Thrown when the method has not been overloaded to return a proper name.
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
     * In order for calls to be routed to the controller without using the controller directly, and thus to lazy-load
     * without using the controller directly, this needs to be used in conjunction with the method
     * [[withAddressableName]].
     *
     * @param this Implicit "this" parameter, which does not need to be supplied.
     * @example
     * ```typescript
     * class MyController extends StateController<MySliceType> {
     *   public static getName() {
     *     return 'MY_CONTROLLER';
     *   }
     *
     *   action = this.registerAction(
     *     (state, payload) => ({
     *       ...state,
     *       ...payload,
     *     })
     *   ).withAddressableName('MY_ACTION'); // <-- also required
     * }
     *
     * MyController.initializeOnExternalAction();
     *
     * export MyController;
     *
     * // ... elsewhere ...
     *
     * // By firing this action, the controller will now be instantiated (if it hasn't been).
     * const myAction = createAction(getActionNameForController('MY_CONTROLLER', 'MY_ACTION'));
     * register.dispatch(myAction);
     * ```
     */
    static initializeOnExternalAction() {
        lazy_loader_1.LazyLoader.registerController(this);
    }
}
exports.Controller = Controller;
