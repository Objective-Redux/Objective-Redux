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
  Middleware,
  AnyAction,
  Unsubscribe,
} from 'redux';
import { LazyLoader } from './lazy-loader';
import { getReduxSagaModule } from './get-redux-saga-module';

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
interface StoreFns {
  dispatch: (action: AnyAction) => AnyAction;
  subscribe(listener: () => void): Unsubscribe;
  replaceReducer: (nextReducer: Reducer<any, AnyAction>) => void;
  getState: () => any;
}

/**
 * @internal
 */
export interface SagaFn<Payload> {
  (payload: Payload): any;
}

/**
 * @internal
 */
/* istanbul ignore next */
const defaultReducer = (): any => ({});

/**
 * The ReduxRegister handles the connection of controllers, reducers, and sagas to Redux. Each ReduxRegister has its
 * own Redux store that it manages. The register will also setup the Redux-Saga middleware, if it finds the dependency.
 *
 * The store is partitioned internally, making it safe to continue calling functions like replaceReducer without
 * affecting how Objective-Redux manages its own reducers.
 *
 * Middleware can be applied at construction. Sagas and reducers can be added at any time, as needed.
 */
export class ReduxRegister {
  private readonly store: Store;

  private readonly sagaMiddleware: any;

  private registeredReducers: ReducerMap = {};

  private replacedReducer: Reducer<any, AnyAction>|null = null;

  private readonly registeredSagas: SagaFn<void>[] = [];

  private readonly storeFns: StoreFns;

  /**
   * Creates an instance of the ReduxRegister.
   *
   * In setting up the instance, the class will create a ReduxStore. If Redux-Saga is available, tbe middleware will be
   * setup automatically as well.
   *
   * @param reducer The initial reducer for the store. This should not include any of the reducers for the controllers.
   * @param initialState The initial state of the store. This should not include the state for any of the controllers.
   * @param middleware Additional middleware to add to the store.
   * @returns An instance of the ReduxRegister.
   * @example
   * ```typescript
   * // No need to setup the Redux-Saga middleware-- Objective-Redux will handle it.
   * const register = new ReduxRegister();
   * ```
   */
  // eslint-disable-next-line max-params
  public constructor(
    reducer: Reducer<any, AnyAction>|null = null,
    initialState: any = {},
    middleware: Middleware<any>[] = []
  ) {
    LazyLoader.addRegister(this, this.addControllerReducer.bind(this));

    const internalMiddleware: Middleware<any>[] = [];
    const reduxSaga = getReduxSagaModule();

    /* istanbul ignore else */
    if (reduxSaga) {
      this.sagaMiddleware = reduxSaga.default({
        context: {
          register: this,
        },
      });
      internalMiddleware[0] = this.sagaMiddleware;
    }

    this.store = createStore(
      defaultReducer,
      initialState,
      applyMiddleware(
        ...middleware,
        ...internalMiddleware
      )
    );

    this.storeFns = this.wrapStore();

    if (reducer) {
      this.replaceReducer(reducer);
    }
  }

  /**
   * Monkey-patch the redux store so that the register can properly partition the store for internal and external use.
   *
   * @returns The original store methods.
   */
  private wrapStore(): StoreFns {
    // Prevent the dispatch method from being re-bound
    const internalDispatch = this.dispatch.bind(this);
    (this as any).dispatch = (action: any): any => internalDispatch(action);

    const { store } = this;

    // Keep the original store functions for use later
    const storeFns = {
      dispatch: store.dispatch.bind(this.store),
      subscribe: store.subscribe.bind(this.store),
      replaceReducer: store.replaceReducer.bind(this.store),
      getState: store.getState.bind(this.store),
    };

    // Map the store functions to register functions
    store.dispatch = this.dispatch.bind(this) as any;
    store.subscribe = this.subscribe.bind(this);
    store.replaceReducer = this.replaceReducer.bind(this);
    store.getState = this.getState.bind(this);

    return storeFns;
  }

  /**
   * Dispatches a Redux action to the store without using a Controller.
   *
   * @param action The action that is to be dispatched via the store.
   * @returns The action that was sent.
   * @example
   * ```typescript
   * const register = new ReduxRegister();
   * register.dispatch(myAction());
   * ```
   */
  public dispatch(action: AnyAction): AnyAction {
    const controller = LazyLoader.getControllerForAction(action);
    if (controller) {
      (controller as any).getInstance(this);
    }
    return this.storeFns.dispatch(action);
  }

  /**
   * Subscribes to the Redux store events.
   *
   * @param listener The callback that will be fired.
   * @returns An unsubscribe function that can be called to stop listening.
   * @example
   * ```
   * const register = new ReduxRegister();
   * const unsubscribeFn = register.subscribe(myCallback);
   * ```
   */
  public subscribe(listener: () => void): Unsubscribe {
    return this.storeFns.subscribe(listener);
  }

  /**
   * Gets the state object from the Redux store.
   *
   * @returns The state object from Redux.
   * @example
   * ```
   * const register = new ReduxRegister();
   * const state = register.getState();
   * ```
   */
  public getState(): any {
    const { external, internal } = this.storeFns.getState();

    return {
      ...external,
      ...internal,
    };
  }

  private updateReducers(): void {
    const external = this.replacedReducer || defaultReducer;
    const internal = combineReducers(this.registeredReducers);

    this.storeFns.replaceReducer(combineReducers({
      external,
      internal,
    }));
  }

  private runSaga(sagaFn: SagaFn<void>): void {
    this.sagaMiddleware.run(sagaFn);
  }

  private addControllerReducer(controller: any): void {
    this.registeredReducers[controller.constructor.getName()] = controller.reducer.bind(controller);
    this.updateReducers();
  }

  /**
   * Replaced the existing reducer with a new one.
   *
   * Note that, by design, this will not affect reducers generated by controllers. Controller reducers are
   * handled separately, which allows other injection mechanisms to use the register without trampling
   * the registers own lazy loading.
   *
   * @param nextReducer The new reducer that will replace the existing reducer.
   */
  public replaceReducer(nextReducer: Reducer<any, AnyAction>): void {
    this.replacedReducer = nextReducer;
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
