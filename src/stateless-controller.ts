// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================
import {
  takeLatest, takeEvery, takeLeading, debounce,
} from 'redux-saga/effects';
import { ReduxRegister, SagaFn } from './redux-register';
import { TakeType } from './take-type';
import { createConnectedAction, ActionFn } from './action';
import { Controller } from './controller';

/**
 * @internal
 */
interface SagaConfig {
  name: string|null;
  takeType: TakeType|null;
  takeConfig: TakeConfig|null;
  sagaFn: SagaFn<any>;
}

/**
 * @internal
 */
export interface TakeConfig {
  debounceTime: number;
}

/**
 * @internal
 */
interface TakeSagaConfig {
  name: string;
  takeType: TakeType;
  takeConfig: TakeConfig|null;
  sagaFn: SagaFn<any>;
}

/**
 * Builder that is returned by the [[StatelessController]] to create and register a saga.
 *
 * @template Payload the payload that the action and the saga will use.
 */
export class SagaBuilder<Payload> {
  private readonly registerFn: (config: SagaConfig) => ActionFn<Payload>;

  private name: string|null;

  private takeType: TakeType|null;

  private takeConfig: TakeConfig|null;

  // eslint-disable-next-line jsdoc/require-description, jsdoc/require-param
  /**
   * @internal
   */
  public constructor(registerFn: (config: SagaConfig) => ActionFn<Payload>) {
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
  public withAddressableName(name: string): SagaBuilder<Payload> {
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
  public withTake(type: TakeType, config: TakeConfig|null = null): SagaBuilder<Payload> {
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
  public register(sagaFn: SagaFn<Payload>): ActionFn<Payload> {
    return this.registerFn({
      name: this.name,
      takeType: this.takeType,
      takeConfig: this.takeConfig,
      sagaFn,
    });
  }
}

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
export abstract class StatelessController extends Controller {
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
  protected constructor(register: ReduxRegister) {
    super(register);
  }

  /**
   * Creates an instance of a [[SagaBuilder]] that will be registered when the builder finishes.
   *
   * @template Payload the payload the action and the saga will take.
   * @returns A builder that registers the saga.
   */
  protected createSaga<Payload>(): SagaBuilder<Payload> {
    return new SagaBuilder<Payload>(this.buildSaga.bind(this));
  }

  private buildSaga<Payload>(config: SagaConfig): ActionFn<Payload> {
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
    return createConnectedAction(name, this.register);
  }

  private createTakeSaga(config: TakeSagaConfig): () => Generator {
    switch (config.takeType) {
      case TakeType.TAKE_LATEST:
        return function* (): any {
          yield takeLatest(config.name, config.sagaFn);
        };
      case TakeType.TAKE_EVERY:
        return function* (): any {
          yield takeEvery(config.name, config.sagaFn);
        };
      case TakeType.TAKE_LEADING:
        return function* (): any {
          yield takeLeading(config.name, config.sagaFn);
        };
      case TakeType.DEBOUNCE:
        return function* (): any {
          yield debounce(config.takeConfig?.debounceTime || 0, config.name, config.sagaFn);
        };
      default:
        throw new Error('Invalid take type');
    }
  }
}
