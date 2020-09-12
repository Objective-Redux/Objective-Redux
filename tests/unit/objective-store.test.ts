// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

const MOCK_STATE = {
  foo: 'bar',
};

const run = jest.fn();
const mockUnsubscribe = jest.fn();
const replaceReducer = jest.fn();
const dispatch = jest.fn(d => d);
const subscribe = jest.fn(() => mockUnsubscribe);
const getState = jest.fn(() => MOCK_STATE);

const sagaMiddleware = {
  run,
};

let mockStore: any;

const COMBINED = 'combined';
const createStore = jest.fn(() => mockStore);
const compose = jest.fn((...m) => m);
const combineReducers = jest.fn(() => COMBINED);
const applyMiddleware = jest.fn((...m) => m);
const createSagaMiddleware = jest.fn(() => sagaMiddleware);

jest.mock('redux', () => ({
  Store: {},
  createStore,
  compose,
  combineReducers,
  applyMiddleware,
}));

const addObjectiveStore = jest.fn();

jest.mock('../../src/lazy-loader', () => ({
  LazyLoader: {
    addObjectiveStore,
  },
}));

const lazyLoadingMiddlewareMock = jest.fn();
const lazyLoadingMiddleware = jest.fn(() => lazyLoadingMiddlewareMock);
jest.mock('../../src/lazy-loading-middleware', () => ({
  lazyLoadingMiddleware,
}));

const preDispatchHookMiddlewareMock = jest.fn();
const preDispatchHookMiddleware = jest.fn(() => preDispatchHookMiddlewareMock);
jest.mock('../../src/pre-dispatch-hook-middleware', () => ({
  preDispatchHookMiddleware,
}));

const setContext = jest.fn();
jest.mock('redux-saga', () => ({ default: createSagaMiddleware }));
jest.mock('redux-saga/effects', () => ({ setContext }));

const setGetObjectiveReduxReducers = jest.fn();
const setSagaRunningFn = jest.fn();
const reducerCreationFn = jest.fn(() => 'TESTING_REDUCER');

jest.mock('../../src/reducer-injector', () => ({
  ReducerInjector: jest.fn().mockImplementation(() => ({
    setGetObjectiveReduxReducers,
    getReducerCreationFn: (): any => reducerCreationFn,
    setSagaRunningFn,
    getSagaRunningFn: (): any => {},
  })),
}));

import { ObjectiveStore } from '../../src';

describe('objective-store', () => {
  beforeEach(() => {
    mockStore ={
      replaceReducer,
      dispatch,
      subscribe,
      getState,
    };
  });

  describe('constructor', () => {
    it('should set up the store without parameters', () => {
      const expectedMiddleware = [
        preDispatchHookMiddlewareMock,
        lazyLoadingMiddlewareMock,
        sagaMiddleware,
      ];
      const store = new ObjectiveStore();
      expect(store).toBeInstanceOf(ObjectiveStore);
      expect(createSagaMiddleware).toBeCalledWith({
        context: {
          store,
        },
      });
      expect(applyMiddleware).toBeCalledWith(...expectedMiddleware);
      expect(compose).toBeCalledWith([], expectedMiddleware);
      expect((createStore.mock.calls[0] as any)[2]).toEqual([[], expectedMiddleware]);
      expect(setGetObjectiveReduxReducers).toHaveBeenCalled();
      expect(setSagaRunningFn).toHaveBeenCalled();
    });

    it('should set up the store with parameters', () => {
      const setGetObjectiveReduxReducersMock = jest.fn();
      const setSagaRunningFnMock = jest.fn();

      const reducer = (): any => {};
      const initialState = {};
      const initialMiddleware: any = [{}];
      const sagaContext: any = { foo: 'bar' };
      const injector: any = {
        setGetObjectiveReduxReducers: setGetObjectiveReduxReducersMock,
        setSagaRunningFn: setSagaRunningFnMock,
      };
      const preDispatchHook = (): Promise<any> => Promise.resolve();

      const expectedMiddleware = [
        preDispatchHookMiddlewareMock,
        lazyLoadingMiddlewareMock,
        sagaMiddleware,
      ];

      const store = new ObjectiveStore({
        reducer,
        initialState,
        middleware: initialMiddleware,
        sagaContext,
        injector,
        preDispatchHook,
      });

      expect(store).toBeInstanceOf(ObjectiveStore);
      expect(createSagaMiddleware).toBeCalledWith({
        context: {
          ...sagaContext,
          store,
        },
      });
      expect(preDispatchHookMiddleware).toBeCalledWith(preDispatchHook);
      expect(applyMiddleware).toBeCalledWith(...expectedMiddleware);
      expect((createStore.mock.calls[0] as any)[1]).toEqual(initialState);
      expect((createStore.mock.calls[0] as any)[2]).toEqual([
        initialMiddleware,
        expectedMiddleware,
      ]);
      expect(setGetObjectiveReduxReducersMock).toHaveBeenCalled();
      const [[fn]] = setGetObjectiveReduxReducersMock.mock.calls;
      expect(fn()).toEqual({});
      expect(setSagaRunningFnMock).toHaveBeenCalled();
    });
  });

  describe('getReducers', () => {
    it('combines only nested reducers', () => {
      const store: any = new ObjectiveStore();
      const flat = (): any => {};
      const nested = {
        foo: (): any => {},
      };
      store.registeredReducers = {
        flat,
        nested,
      };
      const resultingReducers = store.getReducers();
      expect(resultingReducers).toEqual({
        flat,
        nested: COMBINED,
      });
    });
  });

  describe('dispatch', () => {
    it('should dispatch an action', () => {
      const store = new ObjectiveStore();
      const action = {
        type: 'MyAction',
      };
      expect(store.dispatch(action)).toEqual(action);
      expect(dispatch).toHaveBeenCalledTimes(1);
    });
  });

  describe('subscribe', () => {
    it('should subscribe to the store', () => {
      const store = new ObjectiveStore();
      const fn = (): void => {};
      const unsubscribe = store.subscribe(fn);
      unsubscribe();
      expect(subscribe).toHaveBeenCalledWith(fn);
      expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('getState', () => {
    it('should get the state object from the store', () => {
      const store = new ObjectiveStore();
      expect(store.getState()).toEqual({ foo: 'bar' });
    });
  });

  describe('addControllerReducer', () => {
    it('adds the new reducer for state controllers', () => {
      const reducer = jest.fn();
      const controller = {
        constructor: {
          getName: (): string => 'TEST_CONTROLLER',
          getNamespace: (): null => null,
          getStoreName: (): string => 'TEST',
        },
        reducer,
      };

      const store = new ObjectiveStore();
      const [[, addControllerReducer]] = addObjectiveStore.mock.calls;
      addControllerReducer(controller);
      expect(store).toBeInstanceOf(ObjectiveStore);
      expect(replaceReducer).toHaveBeenCalledWith('TESTING_REDUCER');
      expect((store as any).registeredReducers.TEST).not.toBeNull();
    });

    it('adds the new, namespaced reducer for state controllers', () => {
      const reducer = jest.fn();
      const controller = {
        constructor: {
          getName: (): string => 'TEST_CONTROLLER',
          getNamespace: (): string => 'NAMESPACE',
          getStoreName: (): string => 'TEST',
        },
        reducer,
      };

      const store = new ObjectiveStore();
      const [[, addControllerReducer]] = addObjectiveStore.mock.calls;
      addControllerReducer(controller);
      expect(store).toBeInstanceOf(ObjectiveStore);
      expect(replaceReducer).toHaveBeenCalledWith('TESTING_REDUCER');
      expect((store as any).registeredReducers.NAMESPACE.TEST).not.toBeNull();
    });
  });

  describe('replaceReducer', () => {
    it('calls replaceReducer on the store', () => {
      const reducer = (): any => {};
      const store = new ObjectiveStore();
      store.replaceReducer(reducer);
      expect(replaceReducer).toHaveBeenCalledWith(reducer);
    });
  });

  describe('registerSaga', () => {
    it('should add the saga to the middleware', () => {
      const saga1 = function* (): Generator {};
      const saga2 = function* (): Generator {};
      const store = new ObjectiveStore();
      store.registerSaga(saga1);
      expect(run).toBeCalledWith(saga1);
      store.registerSaga(saga2);
      expect(run).toBeCalledWith(saga2);
    });
  });
});
