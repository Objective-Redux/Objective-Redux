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

const middleware = {
  run,
};

let mockStore: any;

const COMBINED = 'combined';
const createStore = jest.fn(() => mockStore);
const compose = jest.fn((...m) => m);
const combineReducers = jest.fn(() => COMBINED);
const applyMiddleware = jest.fn((...m) => m);
const createSagaMiddleware = jest.fn(() => middleware);

jest.mock('redux', () => ({
  Store: {},
  createStore,
  compose,
  combineReducers,
  applyMiddleware,
}));

const getControllerForAction = jest.fn();
const addRegister = jest.fn();

jest.mock('../../src/lazy-loader', () => ({
  LazyLoader: {
    getControllerForAction,
    addRegister,
  },
}));

const setContext = jest.fn();
jest.mock('redux-saga', () => ({ default: createSagaMiddleware }));
jest.mock('redux-saga/effects', () => ({ setContext }));

const setGetObjectiveReduxReducers = jest.fn();
const reducerCreationFn = jest.fn(() => 'TESTING_REDUCER');

jest.mock('../../src/reducer-injector', () => ({
  ReducerInjector: jest.fn().mockImplementation(() => ({
    setGetObjectiveReduxReducers,
    getReducerCreationFn: (): any => reducerCreationFn,
  })),
}));

import { ReduxRegister } from '../../src';

describe('redux-register', () => {
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
      const register = new ReduxRegister();
      expect(register).toBeInstanceOf(ReduxRegister);
      expect(createSagaMiddleware).toBeCalledWith({
        register,
      });
      expect(applyMiddleware).toBeCalledWith(middleware);
      expect(compose).toBeCalledWith([middleware]);
      expect((createStore.mock.calls[0] as any)[2]).toEqual([[middleware]]);
      expect(setGetObjectiveReduxReducers).toHaveBeenCalled();
    });

    it('should set up the store with parameters', () => {
      const setGetObjectiveReduxReducersMock = jest.fn();

      const reducer = (): any => {};
      const initialState = {};
      const initialMiddleware: any = [{}];
      const sagaContext: any = { foo: 'bar' };
      const injector: any = {
        setGetObjectiveReduxReducers: setGetObjectiveReduxReducersMock,
      };

      const register = new ReduxRegister({
        reducer,
        initialState,
        middleware: initialMiddleware,
        sagaContext,
        injector,
      });

      expect(register).toBeInstanceOf(ReduxRegister);
      expect(createSagaMiddleware).toBeCalledWith({
        ...sagaContext,
        register,
      });
      expect((applyMiddleware.mock.calls[0] as any)[0]).toBe(middleware);
      expect((createStore.mock.calls[0] as any)[1]).toEqual(initialState);
      expect((createStore.mock.calls[0] as any)[2]).toEqual([
        ...initialMiddleware,
        [middleware],
      ]);
      expect(setGetObjectiveReduxReducersMock).toHaveBeenCalled();
      const [[fn]] = setGetObjectiveReduxReducersMock.mock.calls;
      expect(fn()).toEqual({});
    });
  });

  describe('getReducers', () => {
    it('combines only nested reducers', () => {
      const register: any = new ReduxRegister();
      const flat = (): any => {};
      const nested = {
        foo: (): any => {},
      };
      register.registeredReducers = {
        flat,
        nested,
      };
      const resultingReducers = register.getReducers();
      expect(resultingReducers).toEqual({
        flat,
        nested: COMBINED,
      });
    });
  });

  describe('dispatch', () => {
    it('should dispatch an action and not lazy-load controller', () => {
      const register = new ReduxRegister();
      const action = {
        type: 'MyAction',
      };
      expect(register.dispatch(action)).toEqual(action);
      expect(dispatch).toHaveBeenCalledTimes(1);
    });

    it('should dispatch an action and lazy-load controller', () => {
      const register = new ReduxRegister();
      const action = {
        type: 'MyAction',
      };
      const getInstance = jest.fn();
      getControllerForAction.mockReturnValue({
        getInstance,
      });
      expect(register.dispatch(action)).toEqual(action);
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(getControllerForAction).toHaveBeenCalled();
    });
  });

  describe('subscribe', () => {
    it('should subscribe to the store', () => {
      const register = new ReduxRegister();
      const fn = (): void => {};
      const unsubscribe = register.subscribe(fn);
      unsubscribe();
      expect(subscribe).toHaveBeenCalledWith(fn);
      expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('getState', () => {
    it('should get the state object from the store', () => {
      const register = new ReduxRegister();
      expect(register.getState()).toEqual({ foo: 'bar' });
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

      const register = new ReduxRegister();
      const [[, addControllerReducer]] = addRegister.mock.calls;
      addControllerReducer(controller);
      expect(register).toBeInstanceOf(ReduxRegister);
      expect(replaceReducer).toHaveBeenCalledWith('TESTING_REDUCER');
      expect((register as any).registeredReducers.TEST).not.toBeNull();
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

      const register = new ReduxRegister();
      const [[, addControllerReducer]] = addRegister.mock.calls;
      addControllerReducer(controller);
      expect(register).toBeInstanceOf(ReduxRegister);
      expect(replaceReducer).toHaveBeenCalledWith('TESTING_REDUCER');
      expect((register as any).registeredReducers.NAMESPACE.TEST).not.toBeNull();
    });
  });

  describe('replaceReducer', () => {
    it('calls replaceReducer on the store', () => {
      const reducer = (): any => {};
      const register = new ReduxRegister();
      register.replaceReducer(reducer);
      expect(replaceReducer).toHaveBeenCalledWith(reducer);
    });
  });

  describe('registerSaga', () => {
    it('should add the saga to the middleware', () => {
      const saga1 = function* (): Generator {};
      const saga2 = function* (): Generator {};
      const register = new ReduxRegister();
      register.registerSaga(saga1);
      expect(run).toBeCalledWith(saga1);
      register.registerSaga(saga2);
      expect(run).toBeCalledWith(saga2);
    });
  });
});
