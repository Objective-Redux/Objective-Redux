"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TakeType = void 0;
// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================
var TakeType;
(function (TakeType) {
    /**
     * Represents a takeLatest watcher.
     */
    TakeType[TakeType["TAKE_LATEST"] = 0] = "TAKE_LATEST";
    /**
     * Represents a takeEvery watcher.
     */
    TakeType[TakeType["TAKE_EVERY"] = 1] = "TAKE_EVERY";
    /**
     * Represents a takeLeading watcher.
     */
    TakeType[TakeType["TAKE_LEADING"] = 2] = "TAKE_LEADING";
    /**
     * Represents a debounce watcher.
     */
    TakeType[TakeType["DEBOUNCE"] = 3] = "DEBOUNCE";
})(TakeType = exports.TakeType || (exports.TakeType = {}));
//# sourceMappingURL=take-type.js.map