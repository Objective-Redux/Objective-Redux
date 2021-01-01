// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2021 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

const getControllerForAction = jest.fn();

jest.mock('../../src/lazy-loader', () => ({
  LazyLoader: {
    getControllerForAction,
  },
}));

import { lazyLoadingMiddleware } from '../../src/lazy-loading-middleware';

describe('lazyLoadingMiddleware', () => {
  it('returns the working middleware and loads a controller', () => {
    const getInstance = jest.fn();
    const mockObjectiveStore: any = {};
    const next = jest.fn();
    const action = {
      type: 'test',
      payload: 'anything',
    };

    getControllerForAction.mockReturnValue({ getInstance });

    const middleware = lazyLoadingMiddleware(mockObjectiveStore);
    middleware()(next)(action);

    expect(getControllerForAction).toBeCalledWith(action);
    expect(getInstance).toBeCalledWith(mockObjectiveStore);
    expect(next).toBeCalledWith(action);
  });

  it('returns the working middleware and does not load a controller', () => {
    const mockObjectiveStore: any = {};
    const next = jest.fn();
    const action = {
      type: 'test',
      payload: 'anything',
    };

    getControllerForAction.mockReturnValue(null);

    const middleware = lazyLoadingMiddleware(mockObjectiveStore);
    middleware()(next)(action);

    expect(getControllerForAction).toBeCalledWith(action);
    expect(next).toBeCalledWith(action);
  });
});
