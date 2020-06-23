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
const take_type_1 = require("./take-type");
const action_1 = require("./action");
const controller_1 = require("./controller");
const get_redux_saga_module_1 = require("./get-redux-saga-module");
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
        this.takeType = null;
        this.takeConfig = null;
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
     * @param type The take type of the watching saga.
     * @param config The configuration of the take type.
     * @returns An instance of the SagaBuilder.
     */
    withTake(type, config = null) {
        this.takeType = type;
        this.takeConfig = config;
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
            takeType: this.takeType,
            takeConfig: this.takeConfig,
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
 *    .withTake(TakeType.TAKE_LATEST)
 *    .register(
 *      function* () {
 *        const register = yield getRegisterFromContext();
 *        yield SwitchStateController.getInstance(register).toggleSwitchValue();
 *        yield SwitchStateController.getInstance(register).incrementCount();
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
        const name = config.name
            ? this.createActionName(config.name)
            : this.createActionName();
        let { sagaFn } = config;
        if (config.takeType !== null) {
            sagaFn = this.createTakeSaga({
                name,
                takeType: config.takeType,
                takeConfig: config.takeConfig,
                sagaFn,
            });
        }
        this.register.registerSaga(sagaFn);
        return action_1.createConnectedAction(name, this.register);
    }
    createTakeSaga(config) {
        const reguxSagaEffects = get_redux_saga_module_1.getReduxSagaEffects();
        switch (config.takeType) {
            case take_type_1.TakeType.TAKE_LATEST:
                return function* () {
                    yield reguxSagaEffects.takeLatest(config.name, config.sagaFn);
                };
            case take_type_1.TakeType.TAKE_EVERY:
                return function* () {
                    yield reguxSagaEffects.takeEvery(config.name, config.sagaFn);
                };
            case take_type_1.TakeType.TAKE_LEADING:
                return function* () {
                    yield reguxSagaEffects.takeLeading(config.name, config.sagaFn);
                };
            case take_type_1.TakeType.DEBOUNCE:
                return function* () {
                    var _a;
                    yield reguxSagaEffects.debounce(((_a = config.takeConfig) === null || _a === void 0 ? void 0 : _a.debounceTime) || 0, config.name, config.sagaFn);
                };
            default:
                throw new Error('Invalid take type');
        }
    }
}
exports.StatelessController = StatelessController;
//# sourceMappingURL=stateless-controller.js.map