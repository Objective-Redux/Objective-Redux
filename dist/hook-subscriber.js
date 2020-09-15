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
exports.HookSubscriber = void 0;
/**
 * @internal
 */
var HookSubscriber = /** @class */ (function () {
    function HookSubscriber(store, updateFn) {
        this.store = store;
        this.updateFn = updateFn;
        this.unsubscribeFn = null;
    }
    HookSubscriber.prototype.subscribe = function () {
        if (!this.unsubscribeFn && this.store) {
            this.unsubscribeFn = this.store.subscribe(this.updateFn);
        }
    };
    HookSubscriber.prototype.unsubscribe = function () {
        if (this.unsubscribeFn) {
            this.unsubscribeFn();
            this.unsubscribeFn = null;
        }
    };
    return HookSubscriber;
}());
exports.HookSubscriber = HookSubscriber;
