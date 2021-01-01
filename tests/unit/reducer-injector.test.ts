// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2021 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

const combineReducers = jest.fn(r => r);

jest.mock('redux', () => ({
  combineReducers,
}));

import { ReducerInjector } from '../../src';
import { defaultReducer } from '../../src/reducer-injector';

describe('ReducerInjector', () => {
  describe('getReducerCreationFn', () => {
    it('returns the default reducer when there are no reducers available', () => {
      const injector = new ReducerInjector();
      expect(injector.getReducerCreationFn()()).toBe(defaultReducer);
    });

    it('returns a combined reducer', () => {
      const a: any = { A: {} };
      const b: any = { B: {} };
      const c: any = { C: {} };
      const injector = new ReducerInjector(a);
      injector.setGetObjectiveReduxReducers(() => c);
      expect(injector.getReducerCreationFn()(b)).toEqual({
        ...a,
        ...b,
        ...c,
      });
      expect(combineReducers).toBeCalled();
    });
  });

  describe('getSagaRunningFn', () => {
    it('returns the saga running functions', () => {
      const fn = jest.fn();
      const saga: any = jest.fn();
      const injector = new ReducerInjector();
      injector.setSagaRunningFn(fn);
      injector.getSagaRunningFn()(saga);
      expect(fn).toBeCalledWith(saga);
    });
  });
});
