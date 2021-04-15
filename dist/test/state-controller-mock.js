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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateControllerMock = void 0;
var state_controller_1 = require("../controllers/state-controller");
/**
 * @internal
 */
var StateControllerMock = /** @class */ (function (_super) {
    __extends(StateControllerMock, _super);
    function StateControllerMock() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StateControllerMock.prototype.createReducingAction = function (fn) {
        var mutationFn = fn;
        mutationFn.withAddressableName = function (name) {
            mutationFn = fn;
            mutationFn.actionName = name;
            return mutationFn;
        };
        return mutationFn;
    };
    StateControllerMock.prototype.internalBuildSaga = function (config) {
        var name = config.name, effectBuilder = config.effectBuilder, sagaFn = config.sagaFn;
        var resultFn = sagaFn;
        resultFn.actionName = name;
        resultFn.effect = effectBuilder;
        resultFn.effectType = effectBuilder === null || effectBuilder === void 0 ? void 0 : effectBuilder.name;
        return resultFn;
    };
    return StateControllerMock;
}(state_controller_1.StateController));
exports.StateControllerMock = StateControllerMock;
