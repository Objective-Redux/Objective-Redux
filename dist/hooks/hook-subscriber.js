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
var deep_equals_1 = require("../helpers/deep-equals");
/**
 * @internal
 */
var HookSubscriber = /** @class */ (function () {
    // eslint-disable-next-line max-params
    function HookSubscriber(objectiveStore, getSlice, updateFn) {
        this.objectiveStore = objectiveStore;
        this.getSlice = getSlice;
        this.updateFn = updateFn;
        this.unsubscribeFn = null;
        this.previousSlice = this.getSlice();
    }
    HookSubscriber.prototype.subscribe = function () {
        var _this = this;
        if (!this.unsubscribeFn && this.objectiveStore) {
            this.unsubscribeFn = this.objectiveStore.subscribe(function () {
                var slice = _this.getSlice();
                if (!deep_equals_1.deepEquals(_this.previousSlice, slice)) {
                    _this.previousSlice = slice;
                    _this.updateFn();
                }
            });
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
