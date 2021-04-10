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
exports.StatelessController = exports.SagaBuilder = void 0;
var action_1 = require("../helpers/action");
var controller_1 = require("./controller");
/**
 * Builder that is returned by the [[StatelessController]] to create and store a saga.
 *
 * @template Payload The payload that the action and the saga will use.
 */
var SagaBuilder = /** @class */ (function () {
    // eslint-disable-next-line jsdoc/require-description, jsdoc/require-param
    /**
     * @internal
     */
    function SagaBuilder(sagaFn, registerFn) {
        this.registerFn = registerFn;
        this.sagaFn = sagaFn;
        this.name = null;
        this.effectBuilder = null;
    }
    /**
     * Adds a specific name to the saga so that it can be addressed without calling the specific action returned by this
     * builder.
     *
     * @param name The name/type of the action.
     * @returns An instance of the SagaBuilder.
     */
    SagaBuilder.prototype.withAddressableName = function (name) {
        this.name = name;
        return this;
    };
    /**
     * Adds a watcher to the saga.
     *
     * Objective-Redux provides some build in configurations, or custom one can be built by using the below paradigm.
     *
     * @example
     * ```typescript
     * // Example of a customer configuration
     * export function configureExample(configurationParameters) {
     *   // provides
     *   //   config.name the which is the action name targeting the saga
     *   //   config.sagaFn the saga function being wrapped
     *   return function EXAMPLE(config) {
     *     return function* () {
     *       yield exampleEffect(config.name, config.sagaFn);
     *     };
     *   };
     *  }
     * ```
     *
     * @param effectBuilder The builder function for the saga watcher. This can be generating using one of the configure
     * functions, such as configureTakeLatest or configureDebounce.
     * @returns An instance of the SagaBuilder.
     */
    SagaBuilder.prototype.withEffect = function (effectBuilder) {
        this.effectBuilder = effectBuilder;
        return this;
    };
    /**
     * Completes the builder and adds the saga to the objectiveStore.
     *
     * @returns An action for calling the saga.
     */
    SagaBuilder.prototype.register = function () {
        return this.registerFn({
            name: this.name,
            effectBuilder: this.effectBuilder,
            sagaFn: this.sagaFn,
        });
    };
    return SagaBuilder;
}());
exports.SagaBuilder = SagaBuilder;
/**
 * Create and manage sagas that are associated with an objectiveStore.
 *
 * @example
 * ```typescript
 * class SwitchStateController extends StatelessController {
 *  getName() {
 *    return 'switch';
 *  }
 *
 *  toggleSwitch = this.createSaga(
 *    function* () {
 *      const controller = yield getControllerFromSagaContext(SwitchStateController);
 *      yield controller.toggleSwitchValue();
 *      yield controller.incrementCount();
 *    }
 *  )
 *    .withAddressableName('MY_ACTION')
 *    .withEffect(configureTakeLatest())
 *    .register();
 * }
 *
 * const instance = SwitchStateController.getInstance(objectiveStore);
 * instance.toggleSwitch();
 * ```
 */
var StatelessController = /** @class */ (function (_super) {
    __extends(StatelessController, _super);
    /**
     * ObjectiveStores and starts the sagas.
     *
     * WARNING: While the constructor can be called directly, controllers are meant to be initialized with the
     * [[getInstance]] method. Creating instances directly can lead to having more than one instance at a time, which may
     * have adverse affects on the application.
     *
     * @returns An instance of the StatelessController.
     */
    // eslint-disable-next-line no-useless-constructor
    function StatelessController() {
        var _this = _super.call(this) || this;
        _this.sagasToRegister = [];
        return _this;
    }
    /**
     * Creates an instance of a [[SagaBuilder]] that will be registered when the builder finishes.
     *
     * @param sagaFn The saga function to add to the ObjectiveStore.
     * @template Payload the payload the action and the saga will take. If void, no action is expected.
     * This template variable is optional.
     * @returns A builder that registers the saga.
     */
    StatelessController.prototype.createSaga = function (sagaFn) {
        return new SagaBuilder(sagaFn, this.buildSaga.bind(this));
    };
    StatelessController.prototype.buildSaga = function (config) {
        var _this = this;
        var name = this.createActionName(config.name);
        var sagaFn = config.sagaFn;
        if (config.effectBuilder !== null) {
            sagaFn = config.effectBuilder({
                name: name,
                sagaFn: sagaFn,
            });
        }
        this.sagasToRegister.push(sagaFn);
        return action_1.createConnectedAction(name, function () { return _this.objectiveStore; });
    };
    StatelessController.prototype.setObjectiveStore = function (objectiveStore) {
        _super.prototype.setObjectiveStore.call(this, objectiveStore);
        while (this.sagasToRegister.length > 0) {
            this.objectiveStore.registerSaga(this.sagasToRegister.pop(), this);
        }
    };
    return StatelessController;
}(controller_1.Controller));
exports.StatelessController = StatelessController;
