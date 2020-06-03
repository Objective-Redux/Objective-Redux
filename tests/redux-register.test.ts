// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

const run = jest.fn();
const replaceReducer = jest.fn();

const middleware = {
  run,
};

const mockStore = {
  replaceReducer,
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

  describe('getStore', () => {
    it('should return the store', () => {
      const register = new ReduxRegister();
      expect(register.getStore()).toEqual(mockStore);
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
