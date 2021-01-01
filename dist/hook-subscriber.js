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
exports.HookSubscriber = void 0;
/**
 * @internal
 */
var HookSubscriber = /** @class */ (function () {
    function HookSubscriber(objectiveStore, updateFn) {
        this.objectiveStore = objectiveStore;
        this.updateFn = updateFn;
        this.unsubscribeFn = null;
    }
    HookSubscriber.prototype.subscribe = function () {
        if (!this.unsubscribeFn && this.objectiveStore) {
            this.unsubscribeFn = this.objectiveStore.subscribe(this.updateFn);
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
