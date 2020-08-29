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
exports.lazyLoadingMiddleware = void 0;
var lazy_loader_1 = require("./lazy-loader");
// eslint-disable-next-line jsdoc/require-description, jsdoc/require-param, jsdoc/require-returns
/**
 * @internal
 */
function lazyLoadingMiddleware(register) {
    return function () { return function (next) { return function (action) {
        var controller = lazy_loader_1.LazyLoader.getControllerForAction(action);
        if (controller) {
            controller.getInstance(register);
        }
        return next(action);
    }; }; };
}
exports.lazyLoadingMiddleware = lazyLoadingMiddleware;
