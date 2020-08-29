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
exports.preDispatchHookMiddleware = void 0;
function preDispatchHookMiddleware(preDispatchHook) {
    return function () { return function (next) { return function (action) {
        var hookResult = preDispatchHook(action);
        if (hookResult === null || hookResult === void 0 ? void 0 : hookResult.then) {
            return hookResult.then(function () { return next(action); });
        }
        else {
            return next(action);
        }
    }; }; };
}
exports.preDispatchHookMiddleware = preDispatchHookMiddleware;
