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
  applyMiddleware,
  createStore,
  compose,
  Middleware,
  AnyAction,
  Unsubscribe,
  combineReducers,
} from 'redux';
import { Action } from './action';
import { LazyLoader } from './lazy-loader';
import { getReduxSagaModule } from './get-redux-saga-module';
import { defaultReducer } from './reducer-injector';
import { lazyLoadingMiddleware } from './lazy-loading-middleware';
import { preDispatchHookMiddleware } from './pre-dispatch-hook-middleware';
import { ReducerInjector } from '.';

/**
 * @internal
 */
type Reducer<S, A> = (prevState: S, action: A) => S

/**
 * @internal
 */
export type PreDispatchHookFn = (action: AnyAction) => any;

interface RegisterOptions {
  /**
   * The initial reducer for the store.
   */
  reducer?: Reducer<any, AnyAction>;
  /**
   * The initial state to which the store should be initialized.
   */
  initialState?: any;
  /**
   * Middleware that should be applied to the store. This should not include saga middleware.
   */
  middleware?: Middleware<any>[];
  /**
   * The context that should be given to sagas.
   */
  sagaContext?: any;
  /**
   * An injector object for adding reducers and sagas to the register.
   */
  injector?: ReducerInjector;
  /**
   * A function that will be called before actions are dispatched.
   * The function should take an action and return either null or a promise. If a promise is returned, the action will
   * be dispatched when the promise resolves.
   */
  preDispatchHook?: PreDispatchHookFn;
}

/**
 * @internal
 */
export interface SagaFn<Payload> {
  (action?: Action<Payload>): any;
}

/* istanbul ignore next */
// eslint-disable-next-line jsdoc/require-description, jsdoc/require-returns
/**
 * @internal
 */
const defaultPreDispatchHook = (): any => null;

/**
 * The ReduxRegister handles the connection of controllers, reducers, and sagas to Redux. Each ReduxRegister has its
 * own Redux store that it manages. The register will also setup the Redux-Saga middleware, if it finds the dependency.
 *
 * Middleware can be applied at construction. Sagas and reducers can be added at any time, as needed.
 */
export class ReduxRegister {
  private readonly store: Store;

  private readonly sagaMiddleware: any;

  private readonly injector: ReducerInjector;

  private readonly registeredReducers: any = {};

  /**
   * Creates an instance of the ReduxRegister.
   *
   * In setting up the instance, the class will create a ReduxStore. If Redux-Saga is available, tbe middleware will be
   * setup automatically as well.
   *
   * @param config The optional configuration for the controller.
   * @param config.reducer The initial reducer for the store.
   * @param config.initialState The initial state of the reducers.
   * @param config.middleware Middle to be added to the Redux store. This should not include the saga middleware.
   * @param config.sagaContext The context to be used when creating the Saga middleware.
   * @param config.injector An instance of the ReducerInjector class.
   * @param config.preDispatchHook A function that takes an action and returns a promise.
   * @returns An instance of the ReduxRegister.
   * @example
   * ```typescript
   * // No need to setup the Redux-Saga middleware-- Objective-Redux will handle it.
   * const register = new ReduxRegister();
   * ```
   * @example
   * ```typescript
   * import { ReducerInjector, ReduxRegister } from 'objective-redux';
   * import { createInjectorsEnhancer } from 'redux-injectors';
   * import { initialState, initialReducers } from './elsewhere';
   *
   * const injector = new ReducerInjector(initialReducers);
   *
   * const createReducer = injector.getReducerCreationFn();
   * const runSaga = injector.getRunSagaFn();
   *
   * const middleware = [
   *   createInjectorsEnhancer({ createReducer, runSaga }),
   * ];
   *
   * const register = new ReduxRegister({
   *   reducer,
   *   initialState,
   *   middleware,
   *   injector,
   * });
   * ```
   */
  // eslint-disable-next-line max-statements
  public constructor(config: RegisterOptions = {}) {
    const {
      reducer = null,
      initialState = {},
      middleware = [],
      sagaContext = null,
      injector = new ReducerInjector(),
      preDispatchHook = defaultPreDispatchHook,
    } = config;

    LazyLoader.addRegister(this, this.addControllerReducer.bind(this));

    const reduxSaga = getReduxSagaModule();
    const internalMiddleware: any[] = [
      preDispatchHookMiddleware(preDispatchHook),
      lazyLoadingMiddleware(this),
    ];

    /* istanbul ignore else */
    if (reduxSaga) {
      const register = this;
      this.sagaMiddleware = reduxSaga.default({
        context: {
          ...sagaContext,
          register,
        },
      });
      internalMiddleware.push(this.sagaMiddleware);
    }

    this.injector = injector;
    this.injector.setGetObjectiveReduxReducers(this.getReducers.bind(this));
    this.injector.setSagaRunningFn(this.sagaMiddleware.run);

    this.store = createStore(
      reducer || defaultReducer,
      initialState,
      compose(
        applyMiddleware(...middleware),
        applyMiddleware(...internalMiddleware)
      )
    );

    this.wrapStore();

    if (reducer) {
      this.replaceReducer(reducer);
    }
  }

  /**
   * Monkey-patch the redux store so that the register can properly bind the store.
   *
   * @returns The original store methods.
   */
  private wrapStore(): void {
    [
      'dispatch',
      'subscribe',
      'replaceReducer',
      'getState',
    ].forEach(fn => {
      const internalFn = (this as any)[fn].bind(this);
      (this as any)[fn] = (...params: any): any => internalFn(...params);
    });

    const {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      dispatch,
      subscribe,
      replaceReducer,
      getState,
      /* eslint-enable @typescript-eslint/no-unused-vars */
      ...otherFns
    } = this.store;

    Object.assign(this, otherFns);
  }

  private getReducers(): any {
    const reducerMap: any = {};
    Object.keys(this.registeredReducers).forEach(
      key => {
        let reducer = this.registeredReducers[key];
        if (typeof reducer == 'object') {
          reducer = combineReducers(reducer);
        }
        reducerMap[key] = reducer;
      }
    );
    return reducerMap;
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
    return this.store.dispatch(action);
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
    return this.store.subscribe(listener);
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
    return this.store.getState();
  }

  private addControllerReducer(controller: any): void {
    const name = controller.constructor.getStoreName();
    const namespace = controller.constructor.getNamespace();
    let placement = this.registeredReducers;
    if (namespace) {
      /* istanbul ignore else */
      if (placement[namespace] == null) {
        placement[namespace] = {};
      }
      placement = placement[namespace];
    }
    placement[name] = controller.reducer.bind(controller);
    this.store.replaceReducer(this.injector.getReducerCreationFn()());
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
    this.store.replaceReducer(nextReducer);
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
    this.sagaMiddleware.run(sagaFn);
  }
}
