import { takeLatest, takeEvery, takeLeading, debounce } from 'redux-saga/effects';
import { ReduxRegister, SagaFn } from './redux-register';
import { TakeType } from './take-type';
import { createConnectedAction, ActionFn } from './action';
import { Controller } from './controller';

interface SagaConfig {
  name: string|null;
  takeType: TakeType|null;
  takeConfig: TakeConfig|null;
  sagaFn: SagaFn<any>;
}

interface TakeConfig {
  debounceTime: number;
}

interface TakeSagaConfig {
  name: string;
  takeType: TakeType;
  takeConfig: TakeConfig|null;
  sagaFn: SagaFn<any>;
}

class SagaBuilder<Payload> {
  private registerFn: (config: SagaConfig) => ActionFn<Payload>;
  private name: string|null;
  private takeType: TakeType|null;
  private takeConfig: TakeConfig|null;

  public constructor(registerFn: (config: SagaConfig) => ActionFn<Payload>) {
    this.registerFn = registerFn;
    this.name = null;
    this.takeType = null;
    this.takeConfig = null;
  }

  withAddressableName(name: string): SagaBuilder<Payload> {
    this.name = name;
    return this;
  }

  withTake(type: TakeType, config: TakeConfig): SagaBuilder<Payload> {
    this.takeType = type;
    this.takeConfig = config;
    return this;
  }

  register(sagaFn: SagaFn<Payload>): ActionFn<Payload> {
    return this.registerFn({
      name: this.name,
      takeType: this.takeType,
      takeConfig: this.takeConfig,
      sagaFn,
    });
  }
}

export abstract class StatelessController extends Controller {
  private static count = 0;

  protected constructor(register: ReduxRegister) {
    super(register);
  }

  /**
   * Generates a unique, default action name
   * @return {string} an action name
   */
  private createActionName(): string {
    return `SAGA/${StatelessController.count++}`;
  }

  /**
   * Begins building a saga
   * @param takeType the saga effect for the watching generator function
   * @param config additional configurations for the watching generator function
   * @returns a builder that registers the saga
   */
  protected registerSaga<Payload>(): SagaBuilder<Payload> {
    return new SagaBuilder<Payload>(this.buildSagaSaga.bind(this));
  }

  protected buildSagaSaga<Payload>(config: SagaConfig): ActionFn<Payload> {
    console.log(config);
    const name = config.name || this.createActionName();
    let sagaFn = config.sagaFn;

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
        return function* () {
          yield takeLatest(config.name, config.sagaFn);
        };
        break;
      case TakeType.TAKE_EVERY:
        return function* () {
          yield takeEvery(config.name, config.sagaFn);
        };
        break;
      case TakeType.TAKE_LEADING:
        return function* () {
          yield takeLeading(config.name, config.sagaFn);
        };
        break;
      case TakeType.DEBOUNCE:
        return function* () {
          yield debounce(config?.takeConfig?.debounceTime || 0, config.name, config.sagaFn);
        };
        break;
      default:
        throw new Error('Invalid take type');
    }
  }
}
