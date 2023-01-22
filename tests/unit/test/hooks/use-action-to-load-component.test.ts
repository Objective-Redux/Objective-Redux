// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2022 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

const useObjectiveStore = jest.fn();

jest.mock('../../../../src/hooks/use-objective-store', () => ({
  useObjectiveStore,
}));

import { useActionToLoadComponent } from '../../../../src/';

describe('use-action-to-load-controller', () => {
  it('returns null when there is not a ObjectiveStore instance', () => {
    useObjectiveStore.mockReturnValue(null);

    const component = useActionToLoadComponent(
      'my-action',
      () => new Promise(rs => rs(true))
    );

    expect(component).toBeNull();
  });

  it('returns null when there is not a ObjectiveStore instance', () => {
    const p = (): any => new Promise(rs => rs(true));
    const watchForActionWithComponent = jest.fn();

    useObjectiveStore.mockReturnValue({
      watchForActionWithComponent,
    });

    watchForActionWithComponent.mockReturnValue('foo');

    const component = useActionToLoadComponent(
      'my-action',
      p
    );

    expect(component).toEqual('foo');
    expect(watchForActionWithComponent).toBeCalledWith('my-action', p);
  });
});
