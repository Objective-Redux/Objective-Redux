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
exports.LazyLoader = void 0;
/**
 * @internal
 */
let LazyLoader = /** @class */ (() => {
    class LazyLoader {
        static registerController(controller) {
            this.loadableControllers[controller.getName()] = controller;
        }
        static getControllerForAction(action) {
            let controller = null;
            const type = (action === null || action === void 0 ? void 0 : action.type) || '';
            const match = type.match('^OBJECTIVE-REDUX-ACTION/([^/]*)/.*$');
            if (match) {
                controller = LazyLoader.loadableControllers[match[1]];
            }
            return controller;
        }
        static addRegister(register, registerReducerFn) {
            this.reducerFns.set(register, registerReducerFn);
            this.controllers.set(register, {});
        }
        // eslint-disable-next-line max-statements
        static getController(register, ControllerClass) {
            const name = ControllerClass.getName();
            const controllerMap = this.controllers.get(register);
            const existing = controllerMap[name];
            if (existing) {
                return existing;
            }
            const instance = new ControllerClass(register);
            controllerMap[name] = instance;
            if (instance.reducer) {
                this.reducerFns.get(register)(instance);
            }
            return instance;
        }
    }
    LazyLoader.loadableControllers = {};
    LazyLoader.reducerFns = new WeakMap();
    LazyLoader.controllers = new WeakMap();
    return LazyLoader;
})();
exports.LazyLoader = LazyLoader;
//# sourceMappingURL=lazy-loader.js.map