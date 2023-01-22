// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2022 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

jest.mock('react', () => ({
  lazy: (p: any): any => p(),
}));

import { PreDispatchWatcher } from '../../../../src/store/pre-dispatch-watcher';

describe('pre-dispatch-watcher', () => {
  it('loads an action when present', async() => {
    const preDispatchWatcher = new PreDispatchWatcher();

    const importCall = jest.fn();
    const p = (): any => new Promise(r => {
      importCall();
      r('Okay');
    });

    preDispatchWatcher.watchForActionWithComponent(
      'my-action',
      p
    );

    await preDispatchWatcher.loadComponentForAction({
      type: 'my-action',
    });

    expect(importCall).toBeCalled();
  });

  it('does nothing when no action is present', () => {
    const preDispatchWatcher = new PreDispatchWatcher();

    const actionResult = preDispatchWatcher.loadComponentForAction({
      type: 'my-action',
    });

    expect(actionResult).toBeNull();
  });

  it('does nothing when no action malformed', () => {
    const preDispatchWatcher = new PreDispatchWatcher();

    const actionResult = preDispatchWatcher.loadComponentForAction(null as any);

    expect(actionResult).toBeNull();
  });

  it('does nothing when no action type is missing', () => {
    const preDispatchWatcher = new PreDispatchWatcher();

    const actionResult = preDispatchWatcher.loadComponentForAction({} as any);

    expect(actionResult).toBeNull();
  });
});
