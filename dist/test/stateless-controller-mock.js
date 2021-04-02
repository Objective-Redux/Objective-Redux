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
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatelessControllerMock = void 0;
var stateless_controller_1 = require("../controllers/stateless-controller");
/**
 * @internal
 */
var StatelessControllerMock = /** @class */ (function (_super) {
    __extends(StatelessControllerMock, _super);
    function StatelessControllerMock() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StatelessControllerMock.prototype.buildSaga = function (config) {
        var name = config.name, effectBuilder = config.effectBuilder, sagaFn = config.sagaFn;
        var resultFn = sagaFn;
        resultFn.actionName = name;
        resultFn.effect = effectBuilder;
        resultFn.effectType = effectBuilder === null || effectBuilder === void 0 ? void 0 : effectBuilder.name;
        return resultFn;
    };
    return StatelessControllerMock;
}(stateless_controller_1.StatelessController));
exports.StatelessControllerMock = StatelessControllerMock;
