// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

const MOCK_STATE = { foo: 'bar' };

const run = jest.fn();
const mockUnsubscribe = jest.fn();
const replaceReducer = jest.fn();
const dispatch = jest.fn(d => d);
const subscribe = jest.fn(() => mockUnsubscribe);
const getState = jest.fn(() => MOCK_STATE);

const middleware = {
  run,
};

const mockStore = {
  replaceReducer,
  dispatch,
  subscribe,
  getState,
};

const combineReducers = jest.fn(r => r);
const createStore = jest.fn(() => mockStore);
const applyMiddleware = jest.fn(m => m);
const createSagaMiddleware = jest.fn(() => middleware);

jest.mock('redux', () => ({
  Store: {},
  combineReducers,
  createStore,
  applyMiddleware,
}));

jest.mock('redux-saga', () => ({ default: createSagaMiddleware }));

import { ReduxRegister } from '../src';

describe('redux-register', () => {
  describe('constructor', () => {
    it('should set up the store', () => {
      const register = new ReduxRegister();
      expect(register).toBeInstanceOf(ReduxRegister);
      expect(createSagaMiddleware).toBeCalledWith({
        context: {
          register: register,
        },
      });
      expect(applyMiddleware).toBeCalledWith(middleware);
      expect((createStore.mock.calls[0] as any)[1]).toEqual(middleware);
    });
  });

  describe('dispatch', () => {
    it('should dispatch an action', () => {
      const register = new ReduxRegister();
      const action = {
        type: 'MyAction',
      };
      expect(register.dispatch(action)).toEqual(action);
      expect(dispatch).toHaveBeenCalledTimes(1);
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
      expect(register.getState()).toBe(MOCK_STATE);
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
      expect(replaceReducer.mock.calls[0][0]).toEqual({
        [name1]: reducer1,
      });

      register.registerReducer(name2, reducer2);
      expect(replaceReducer.mock.calls[1][0]).toEqual({
        [name1]: reducer1,
        [name2]: reducer2,
      });
    });
  });

  describe('registerReducers', () => {
    it('should add multiple reducers without removing existing ones', () => {
      const reducer1 = (): any => {};
      const reducer2 = (): any => {};
      const reducer3 = (): any => {};

      const register = new ReduxRegister();
      register.registerReducers({
        one: reducer1,
      });

      expect(replaceReducer.mock.calls[0][0]).toEqual({
        one: reducer1,
      });

      register.registerReducers({
        two: reducer2,
        three: reducer3,
      });

      expect(replaceReducer.mock.calls[1][0]).toEqual({
        one: reducer1,
        two: reducer2,
        three: reducer3,
      });
    });
  });

  describe('registerSaga', () => {
    it('should add teh saga to the middleware', () => {
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
