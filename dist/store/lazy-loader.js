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
    LazyLoader.addObjectiveStore = function (objectiveStore, storeFns) {
        this.storeFns.set(objectiveStore, storeFns);
        this.controllers.set(objectiveStore, {});
    };
    // eslint-disable-next-line max-statements
    LazyLoader.getController = function (objectiveStore, ControllerClass) {
        var name = ControllerClass.getName();
        var namespace = ControllerClass.getNamespace() || '';
        var controllerMap = this.controllers.get(objectiveStore);
        /* istanbul ignore else */
        if (controllerMap) {
            if (controllerMap[namespace] == null) {
                controllerMap[namespace] = {};
            }
            var existing = controllerMap[namespace][name];
            if (existing) {
                return existing;
            }
        }
        var instance = new ControllerClass();
        instance.setObjectiveStore(objectiveStore);
        /* istanbul ignore else */
        if (controllerMap) {
            controllerMap[namespace][name] = instance;
        }
        if (instance.reducer) {
            this.storeFns.get(objectiveStore).registerReducerFn(instance);
        }
        return instance;
    };
    LazyLoader.removeController = function (objectiveStore, ControllerClass) {
        var name = ControllerClass.getName();
        var namespace = ControllerClass.getNamespace() || '';
        var controllerMap = this.controllers.get(objectiveStore) || {};
        if (controllerMap[namespace] != null && controllerMap[namespace][name] != null) {
            var existing = controllerMap[namespace][name];
            if (existing.reducer) {
                this.storeFns.get(objectiveStore).unregisterReducerFn(existing);
            }
            else {
                this.storeFns.get(objectiveStore).cancelSagasForController(existing);
            }
            delete controllerMap[namespace][name];
        }
    };
    LazyLoader.loadableControllers = {};
    LazyLoader.storeFns = new WeakMap();
    LazyLoader.controllers = new WeakMap();
    return LazyLoader;
}());
exports.LazyLoader = LazyLoader;
