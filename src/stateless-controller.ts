import { takeLatest, takeEvery, takeLeading, debounce } from 'redux-saga/effects';
import { ReduxRegister, SagaFn } from './redux-register';
import { TakeType } from './take-type';
import { createConnectedAction, ActionFn } from './action';
import { Controller } from './controller';

interface SagaConfig {
  name: string;
  takeType: TakeType;
  sagaFn: SagaFn<any>;
  debounceTime?: number;
}

interface TakeConfig {
  debounceTime: number;
}

interface SagaBuilder<Payload> {
  register: (sagaFn: SagaFn<Payload>) => ActionFn<Payload>;
  withAddressableName: (name: string) => SagaBuilder<Payload>;
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
  protected createActionName(): string {
    return `SAGA/${StatelessController.count++}`;
  }

  /**
   * Begins building a saga
   * @param takeType the saga effect for the watching generator function
   * @param config additional configurations for the watching generator function
   * @returns a builder that registers the saga
   */
  protected createSagaWithTake<Payload>(takeType: TakeType, config?: TakeConfig): SagaBuilder<Payload> {
    let actionName = this.createActionName();

    /**
     * Registers the generator function for the saga
     * @param sagaFn the generator function being registered; the function should be in the form
     * ```
     * function* (payload?) { ... }
     * ```
     * @returns the action producing function for calling the saga
     */
    const register = (sagaFn: SagaFn<Payload>): ActionFn<Payload> => {
      const fn = function* (action: any): any {
        yield* sagaFn(action.payload);
      };

      this.registerSagaByType({
        name: actionName,
        sagaFn: fn,
        takeType,
        debounceTime: config?.debounceTime,
      });

      return createConnectedAction<Payload>(actionName, this.register);
    };

    /**
     * Adds a specific name to the saga so that it can be addressed without calling the specific action returned by this builder
     * @param name the name of the action
     * @returns a builder that registers the saga
     */
    const withAddressableName = (name: string): SagaBuilder<Payload> => {
      actionName = name;

      return {
        register,
        withAddressableName,
      };
    };

    return {
      register,
      withAddressableName,
    };
  }

  /**
   * Registers a saga after wrapping it in a watching generator function
   * @param config the configuration for the saga being registered
   */
  private registerSagaByType(config: SagaConfig): void {
    switch (config.takeType) {
      case TakeType.TAKE_LATEST:
        this.register.registerSaga(function* () {
          yield takeLatest(config.name, config.sagaFn);
        });
        break;
      case TakeType.TAKE_EVERY:
        this.register.registerSaga(function* () {
          yield takeEvery(config.name, config.sagaFn);
        });
        break;
      case TakeType.TAKE_LEADING:
        this.register.registerSaga(function* () {
          yield takeLeading(config.name, config.sagaFn);
        });
        break;
      case TakeType.DEBOUNCE:
        this.register.registerSaga(function* () {
          yield debounce(config.debounceTime || 0, config.name, config.sagaFn);
        });
        break;
    }
  }
}
