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
exports.getActionNameForController = exports.useRegisterFromReactContext = exports.getRegisterFromSagaContext = exports.ComponentConnector = exports.RegisterProvider = exports.createAction = exports.TakeType = exports.StatelessController = exports.StateController = exports.ReduxRegister = void 0;
const redux_register_1 = require("./redux-register");
Object.defineProperty(exports, "ReduxRegister", { enumerable: true, get: function () { return redux_register_1.ReduxRegister; } });
const state_controller_1 = require("./state-controller");
Object.defineProperty(exports, "StateController", { enumerable: true, get: function () { return state_controller_1.StateController; } });
const stateless_controller_1 = require("./stateless-controller");
Object.defineProperty(exports, "StatelessController", { enumerable: true, get: function () { return stateless_controller_1.StatelessController; } });
const take_type_1 = require("./take-type");
Object.defineProperty(exports, "TakeType", { enumerable: true, get: function () { return take_type_1.TakeType; } });
const action_1 = require("./action");
Object.defineProperty(exports, "createAction", { enumerable: true, get: function () { return action_1.createAction; } });
Object.defineProperty(exports, "getActionNameForController", { enumerable: true, get: function () { return action_1.getActionNameForController; } });
const register_provider_1 = require("./register-provider");
Object.defineProperty(exports, "RegisterProvider", { enumerable: true, get: function () { return register_provider_1.RegisterProvider; } });
const component_connector_1 = require("./component-connector");
Object.defineProperty(exports, "ComponentConnector", { enumerable: true, get: function () { return component_connector_1.ComponentConnector; } });
const get_register_from_saga_context_1 = require("./get-register-from-saga-context");
Object.defineProperty(exports, "getRegisterFromSagaContext", { enumerable: true, get: function () { return get_register_from_saga_context_1.getRegisterFromSagaContext; } });
const use_register_from_react_context_1 = require("./use-register-from-react-context");
Object.defineProperty(exports, "useRegisterFromReactContext", { enumerable: true, get: function () { return use_register_from_react_context_1.useRegisterFromReactContext; } });
//# sourceMappingURL=index.js.map