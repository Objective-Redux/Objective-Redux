// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2022 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import { preDispatchHookMiddleware } from '../../../../src/store/pre-dispatch-hook-middleware';

describe('preDispatchHookMiddleware', () => {
  it('should call the pre-dispatch function returning promise', done => {
    const preDispatchHookFn = jest.fn(() => Promise.resolve());
    const next = jest.fn(() => done());
    const action = {};
    preDispatchHookMiddleware(preDispatchHookFn)()(next)(action);
    expect(preDispatchHookFn).toBeCalledWith(action);
  });

  it('should call the pre-dispatch function returning non-promise', done => {
    const preDispatchHookFn = jest.fn(() => null);
    const next = jest.fn(() => done());
    const action = {};
    preDispatchHookMiddleware(preDispatchHookFn)()(next)(action);
    expect(preDispatchHookFn).toBeCalledWith(action);
  });
});
