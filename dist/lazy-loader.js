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
var LazyLoader = /** @class */ (function () {
    function LazyLoader() {
    }
    LazyLoader.registerController = function (controller) {
        var namespace = controller.getNamespace() || '';
        /* istanbul ignore else */
        if (this.loadableControllers[namespace] == null) {
            this.loadableControllers[namespace] = {};
        }
        this.loadableControllers[namespace][controller.getName()] = controller;
    };
    LazyLoader.getControllerForAction = function (action) {
        var controller = null;
        var type = (action === null || action === void 0 ? void 0 : action.type) || '';
        var match = type.match('^OBJECTIVE-REDUX-ACTION/(.*?)::([^/]*)/.*$');
        if (match && LazyLoader.loadableControllers[match[1]]) {
            controller = LazyLoader.loadableControllers[match[1]][match[2]];
        }
        return controller;
    };
    LazyLoader.addRegister = function (register, registerReducerFn) {
        this.reducerFns.set(register, registerReducerFn);
        this.controllers.set(register, {});
    };
    // eslint-disable-next-line max-statements
    LazyLoader.getController = function (register, ControllerClass) {
        var name = ControllerClass.getName();
        var namespace = ControllerClass.getNamespace() || '';
        var controllerMap = this.controllers.get(register);
        if (controllerMap[namespace] == null) {
            controllerMap[namespace] = {};
        }
        var existing = controllerMap[namespace][name];
        if (existing) {
            return existing;
        }
        var instance = new ControllerClass(register);
        controllerMap[namespace][name] = instance;
        if (instance.reducer) {
            this.reducerFns.get(register)(instance);
        }
        return instance;
    };
    LazyLoader.loadableControllers = {};
    LazyLoader.reducerFns = new WeakMap();
    LazyLoader.controllers = new WeakMap();
    return LazyLoader;
}());
exports.LazyLoader = LazyLoader;
