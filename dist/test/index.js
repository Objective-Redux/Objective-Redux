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
exports.mocked = exports.actual = void 0;
/* istanbul ignore file */
var objective_store_1 = require("../store/objective-store");
var reducer_injector_1 = require("../store/reducer-injector");
var state_controller_1 = require("../controllers/state-controller");
var stateless_controller_1 = require("../controllers/stateless-controller");
var action_1 = require("../helpers/action");
var objective_store_provider_1 = require("../components/objective-store-provider");
var component_connector_1 = require("../components/component-connector");
var get_objective_store_from_saga_context_1 = require("../hooks/get-objective-store-from-saga-context");
var get_controller_from_saga_context_1 = require("../hooks/get-controller-from-saga-context");
var use_objective_store_1 = require("../hooks/use-objective-store");
var use_controller_1 = require("../hooks/use-controller");
var use_selector_1 = require("../hooks/use-selector");
var stateless_controller_mock_1 = require("./stateless-controller-mock");
var state_controller_mock_1 = require("./state-controller-mock");
var effect_type_1 = require("../helpers/effect-type");
Object.defineProperty(exports, "configureTakeLatest", { enumerable: true, get: function () { return effect_type_1.configureTakeLatest; } });
Object.defineProperty(exports, "configureTakeEvery", { enumerable: true, get: function () { return effect_type_1.configureTakeEvery; } });
Object.defineProperty(exports, "configureTakeLeading", { enumerable: true, get: function () { return effect_type_1.configureTakeLeading; } });
Object.defineProperty(exports, "configureDebounce", { enumerable: true, get: function () { return effect_type_1.configureDebounce; } });
Object.defineProperty(exports, "configureTake", { enumerable: true, get: function () { return effect_type_1.configureTake; } });
exports.actual = {
    ObjectiveStore: objective_store_1.ObjectiveStore,
    ReducerInjector: reducer_injector_1.ReducerInjector,
    StateController: state_controller_1.StateController,
    StatelessController: stateless_controller_1.StatelessController,
    createAction: action_1.createAction,
    getActionNameForController: action_1.getActionNameForController,
    ObjectiveStoreProvider: objective_store_provider_1.ObjectiveStoreProvider,
    ComponentConnector: component_connector_1.ComponentConnector,
    getObjectiveStoreFromSagaContext: get_objective_store_from_saga_context_1.getObjectiveStoreFromSagaContext,
    getControllerFromSagaContext: get_controller_from_saga_context_1.getControllerFromSagaContext,
    useObjectiveStore: use_objective_store_1.useObjectiveStore,
    useController: use_controller_1.useController,
    useSelector: use_selector_1.useSelector,
};
exports.mocked = {
    StatelessController: stateless_controller_mock_1.StatelessControllerMock,
    StateController: state_controller_mock_1.StateControllerMock,
};
