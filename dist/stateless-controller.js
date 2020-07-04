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
exports.StatelessController = exports.SagaBuilder = void 0;
const action_1 = require("./action");
const controller_1 = require("./controller");
/**
 * Builder that is returned by the [[StatelessController]] to create and register a saga.
 *
 * @template Payload The payload that the action and the saga will use.
 */
class SagaBuilder {
    // eslint-disable-next-line jsdoc/require-description, jsdoc/require-param
    /**
     * @internal
     */
    constructor(registerFn) {
        this.registerFn = registerFn;
        this.name = null;
        this.takeBuilder = null;
    }
    /**
     * Adds a specific name to the saga so that it can be addressed without calling the specific action returned by this
     * builder.
     *
     * @param name The name/type of the action.
     * @returns An instance of the SagaBuilder.
     */
    withAddressableName(name) {
        this.name = name;
        return this;
    }
    /**
     * Adds a simple watcher to the saga.
     *
     * @param takeBuilder The builder function for the saga watcher. This can be generating using one of the configure
     * functions, such as configureTakeLatest or configureDebounce.
     * @returns An instance of the SagaBuilder.
     */
    withTake(takeBuilder) {
        this.takeBuilder = takeBuilder;
        return this;
    }
    /**
     * Completes the builder and adds the saga to the register.
     *
     * @param sagaFn The saga function to add to the ReduxRegister.
     * @returns An action for calling the saga.
     */
    register(sagaFn) {
        return this.registerFn({
            name: this.name,
            takeBuilder: this.takeBuilder,
            sagaFn,
        });
    }
}
exports.SagaBuilder = SagaBuilder;
/**
 * Create and manage sagas that are associated with a Redux store.
 *
 * @example
 * ```typescript
 * class SwitchStateSagas extends StatelessController {
 *  getName() {
 *    return 'switch-sagas';
 *  }
 *
 *  toggleSwitch = this.createSaga()
 *    .withTake(configureTakeLatest())
 *    .register(
 *      function* () {
 *        const controller = yield getControllerFromSagaContext(SwitchStateController);
 *        yield controller.toggleSwitchValue();
 *        yield controller.incrementCount();
 *      }
 *    );
 * }
 *
 * const instance = SwitchStateSagas.getInstance(register);
 * instance.toggleSwitch();
 * ```
 */
class StatelessController extends controller_1.Controller {
    /**
     * Registers and starts the sagas.
     *
     * _WARNING: While the constructor can be called directly, state controllers are meant to be initialized with the
     * [[getInstance]] method. Creating instances directly can lead to having more than one instance at a time, which may
     * have adverse affects on the application._.
     *
     * @param register Rhe ReduxRegister instance to which the controller will be connected.
     * @returns An instance of the StatelessController.
     */
    // eslint-disable-next-line no-useless-constructor
    constructor(register) {
        super(register);
    }
    /**
     * Creates an instance of a [[SagaBuilder]] that will be registered when the builder finishes.
     *
     * @template Payload the payload the action and the saga will take.
     * @returns A builder that registers the saga.
     */
    createSaga() {
        return new SagaBuilder(this.buildSaga.bind(this));
    }
    buildSaga(config) {
        const name = this.createActionName(config.name);
        let { sagaFn } = config;
        if (config.takeBuilder !== null) {
            sagaFn = config.takeBuilder({
                name,
                sagaFn,
            });
        }
        this.register.registerSaga(sagaFn);
        return action_1.createConnectedAction(name, this.register);
    }
}
exports.StatelessController = StatelessController;
