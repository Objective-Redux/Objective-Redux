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
  Store,
  combineReducers,
  createStore,
  applyMiddleware,
} from 'redux';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';

/**
 * @internal
 */
type Reducer<S, A> = (prevState: S, action: A) => S

/**
 * @internal
 */
interface ReducerMap {
  [reducer: string]: Reducer<any, any>;
}

/**
 * @internal
 */
export interface SagaFn<Payload> {
  (payload: Payload): any;
}

/**
 * The ReduxRegister handles the connection of controllers, reducers, and sagas to Redux. Each ReduxRegister has its
 * own Redux store that it manages.
 */
export class ReduxRegister {
  private readonly store: Store;

  private readonly sagaMiddleware: SagaMiddleware<object>;

  private readonly registeredReducers: ReducerMap = {};

  private readonly registeredSagas: SagaFn<void>[] = [];

  /**
   * Creates an instance of the ReduxRegister.
   *
   * In setting up the instance, the class will create a ReduxStore.
   *
   * @returns An instance of the ReduxRegister.
   * @example
   * ```typescript
   * const register = new ReduxRegister();
   * ```
   */
  public constructor() {
    this.sagaMiddleware = createSagaMiddleware({
      context: {
        register: this,
      },
    });
    this.store = createStore(
      /* istanbul ignore next */
      () => {},
      applyMiddleware(this.sagaMiddleware)
    );
  }

  /**
   * Returns the Redux store that is managed by the register instance.
   *
   * _WARNING: Do not attempt to connect reducers, sagas, or other components (including middleware) to the store
   * directly. The register instance will override the values any time new controllers are connected._.
   *
   * @returns The Redux store associated with the ReduxRegister instance.
   * @example
   * ```typescript
   * const register = new ReduxRegister();
   * register.getStore().dispatch(myAction());
   * ```
   */
  public getStore(): Store {
    return this.store;
  }

  private updateReducers(): void {
    this.store.replaceReducer(combineReducers(
      this.registeredReducers
    ));
  }

  private runSaga(sagaFn: SagaFn<void>): void {
    this.sagaMiddleware.run(sagaFn);
  }

  /**
   * Adds a reducer to the register's Redux store.
   *
   * @param name The name of the reducer/the name of the state slice.
   * @param reducerFn The reducer that is being registered.
   * @example
   * ```typescript
   * const reducer = (state = { isOn: false }, action) {
   *   switch (action.type) {
   *     case 'MY_ACTION':
   *       return {
   *         ...state,
   *         isOn: !state.isOn,
   *       };
   *     default:
   *       return state;
   *   }
   * };
   *
   * const register = new ReduxRegister();
   * register.registerReducer('switch', reducer);
   * ```
   */
  public registerReducer(name: string, reducerFn: Reducer<any, any>): void {
    this.registeredReducers[name] = reducerFn;
    this.updateReducers();
  }

  /**
   * Adds and and begins running a saga as part in the context of the store that the register manages.
   *
   * @param sagaFn The saga to add to the register.
   * @example
   * ```typescript
   * function* sagaFn() {
   *   yield console.log('Hello, world!');
   * }
   *
   * const register = new ReduxRegister();
   * register.registerSaga(sagaFn);
   * ```
   */
  public registerSaga(sagaFn: SagaFn<void>): void {
    this.registeredSagas.push(sagaFn);
    this.runSaga(sagaFn);
  }
}
