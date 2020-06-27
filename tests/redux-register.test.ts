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
  internal: { foo: 'bar' },
  external: {},
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

const combineReducers = jest.fn(r => r);
const createStore = jest.fn(() => mockStore);
const applyMiddleware = jest.fn((...m) => m);
const createSagaMiddleware = jest.fn(() => middleware);

jest.mock('redux', () => ({
  Store: {},
  combineReducers,
  createStore,
  applyMiddleware,
}));

const getControllerForAction = jest.fn();

jest.mock('../src/lazy-loader', () => ({
  LazyLoader: {
    getControllerForAction,
  },
}));

jest.mock('redux-saga', () => ({ default: createSagaMiddleware }));

import { ReduxRegister } from '../src';

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
        context: {
          register: register,
        },
      });
      expect(applyMiddleware).toBeCalledWith(middleware);
      expect((createStore.mock.calls[0] as any)[2]).toEqual([middleware]);
    });

    it('should set up the store with parameters', () => {
      const reducer = (): any => {};
      const initialState = {};
      const initialMiddleware: any = [{}];

      const register = new ReduxRegister(
        reducer,
        initialState,
        initialMiddleware
      );

      expect(register).toBeInstanceOf(ReduxRegister);
      expect(createSagaMiddleware).toBeCalledWith({
        context: {
          register: register,
        },
      });
      expect((applyMiddleware.mock.calls[0] as any)[0]).toBe(initialMiddleware[0]);
      expect((createStore.mock.calls[0] as any)[1]).toEqual(initialState);
      expect((createStore.mock.calls[0] as any)[2]).toEqual([
        ...initialMiddleware,
        middleware,
      ]);
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

  describe('registerReducer', () => {
    it('should add the reducer to the store', () => {
      const name1 = 'NAME_1';
      const name2 = 'NAME_2';
      const reducer1 = (): any => {};
      const reducer2 = (): any => {};

      const register = new ReduxRegister();
      register.registerReducer(name1, reducer1);
      expect(replaceReducer.mock.calls[0][0].external).toBeInstanceOf(Function);
      expect(replaceReducer.mock.calls[0][0].internal).toEqual({
        [name1]: reducer1,
      });

      register.registerReducer(name2, reducer2);
      expect(replaceReducer.mock.calls[1][0].external).toBeInstanceOf(Function);
      expect(replaceReducer.mock.calls[1][0].internal).toEqual({
        [name1]: reducer1,
        [name2]: reducer2,
      });
    });
  });

  describe('replaceReducer', () => {
    it('should replace the reducer function', () => {
      const register = new ReduxRegister();
      const reducer = (): any => {};
      register.replaceReducer(reducer);
      expect(replaceReducer.mock.calls[0][0].external).toBe(reducer);
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
