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
exports.useRegisterFromReactContext = void 0;
const react_1 = require("react");
const context_1 = require("./context");
exports.useRegisterFromReactContext = () => {
    return react_1.useContext(context_1.RegisterProviderContext);
};
//# sourceMappingURL=get-register-for-component.js.map