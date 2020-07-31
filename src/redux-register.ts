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
import { getReduxSagaModule, getReduxSagaEffects } from './get-redux-saga-module';
import { defaultReducer } from './reducer-injector';
import { ReducerInjector } from '.';

/**
 * @internal
 */
type Reducer<S, A> = (prevState: S, action: A) => S

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
interface RegisterOptions {
  reducer?: Reducer<any, AnyAction>;
  initialState?: any;
  middleware?: Middleware<any>[];
  sagaMiddleware?: Middleware<any>;
  injector?: ReducerInjector;
}

/**
 * @internal
 */
export interface SagaFn<Payload> {
  (action?: Action<Payload>): any;
}

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

  private readonly storeFns: StoreFns;

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
   * @param config.sagaMiddleware The saga middleware, if you do not want Objective-Redux to create it for you.
   * @param config.injector An instance of the ReducerInjector class.
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
   * import createSagaMiddleware from 'redux-saga';
   * import { initialState, initialReducers } from './elsewhere';
   *
   * const injector = new ReducerInjector(initialReducers);
   * const sagaMiddleware = createSagaMiddleware();
   *
   * const createReducer = injector.getReducerCreationFn();
   * const runSaga = sagaMiddleware.run;
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
   *   sagaMiddleware,
   * });
   * ```
   */
  public constructor(config: RegisterOptions = {}) {
    const {
      reducer = null,
      initialState = {},
      middleware = [],
      sagaMiddleware = null,
      injector = new ReducerInjector(),
    } = config;

    this.injector = injector;
    this.injector.setGetObjectiveReduxReducers(this.getReducers.bind(this));

    LazyLoader.addRegister(this, this.addControllerReducer.bind(this));

    const internalMiddleware: any[] = [];
    this.sagaMiddleware = this.setupSagaMiddleware(sagaMiddleware);

    /* istanbul ignore else */
    if (this.sagaMiddleware) {
      internalMiddleware[0] = applyMiddleware(this.sagaMiddleware);
    }

    this.store = createStore(
      reducer || defaultReducer,
      initialState,
      compose(
        ...middleware,
        ...internalMiddleware
      )
    );

    this.storeFns = this.wrapStore();

    if (reducer) {
      this.replaceReducer(reducer);
    }
  }

  private setupSagaMiddleware(sagaMiddleware: any): Middleware<any>|null {
    let middleware = null;

    if (sagaMiddleware) {
      middleware = sagaMiddleware;
    } else {
      /* istanbul ignore next */
      middleware = getReduxSagaModule()?.default();
    }

    return middleware;
  }

  /**
   * Monkey-patch the redux store so that the register can properly bind the store.
   *
   * @returns The original store methods.
   */
  private wrapStore(): StoreFns {
    // Prevent the dispatch method from being re-bound
    const internalDispatch = this.dispatch.bind(this);
    (this as any).dispatch = (action: any): any => internalDispatch(action);

    const { store } = this;
    const {
      dispatch,
      subscribe,
      replaceReducer,
      getState,
      ...otherFns
    } = store;

    // Keep the original store functions for use later
    const storeFns = {
      dispatch: dispatch.bind(this.store),
      subscribe: subscribe.bind(this.store),
      replaceReducer: replaceReducer.bind(this.store),
      getState: getState.bind(this.store),
    };

    Object.assign(this, otherFns);

    // Map the store functions to register functions
    store.dispatch = this.dispatch.bind(this) as any;
    store.subscribe = this.subscribe.bind(this);
    store.replaceReducer = this.replaceReducer.bind(this);
    store.getState = this.getState.bind(this);

    return storeFns;
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
    return this.storeFns.getState();
  }

  private runSaga(sagaFn: SagaFn<void>): void {
    this.sagaMiddleware.run(sagaFn);
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
    this.storeFns.replaceReducer(this.injector.getReducerCreationFn()());
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
    this.storeFns.replaceReducer(nextReducer);
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
    this.runSaga(
      function* (this: any): any {
        yield getReduxSagaEffects().setContext({ register: this });
        yield sagaFn();
      }.bind(this)
    );
  }
}
