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
exports.ControllerNameNotDefined = void 0;
/**
 * Thrown when the method getName of a controller instance has not been implemented.
 */
var ControllerNameNotDefined = /** @class */ (function (_super) {
    __extends(ControllerNameNotDefined, _super);
    function ControllerNameNotDefined() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ControllerNameNotDefined;
}(Error));
exports.ControllerNameNotDefined = ControllerNameNotDefined;
