// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

const registerStateController = jest.fn();
const registerMock = {
  registerStateController,
};

const useObjectiveStore = jest.fn();

jest.mock('../../src/use-objective-store', () => ({
  useObjectiveStore,
}));

const getController = jest.fn((objectiveStore, CClass) => new CClass(objectiveStore));

jest.mock('../../src/lazy-loader', () => ({
  LazyLoader: {
    getController,
  },
}));

import { useController, StatelessController } from '../../src';

class TestController extends StatelessController {
  // eslint-disable-next-line no-useless-constructor
  public constructor(objectiveStore: any) {
    super(objectiveStore);
  }

  public static getName(): string {
    return 'TestController';
  }
}

describe('use-controller', () => {
  it('returns an instance of the controller when there is a ObjectiveStore instance', () => {
    useObjectiveStore.mockReturnValue(registerMock);
    const controller = useController(TestController);
    expect(controller).toBeInstanceOf(TestController);
  });

  it('returns null when there is not a ObjectiveStore instance', () => {
    useObjectiveStore.mockReturnValue(null);
    const controller = useController(TestController);
    expect(controller).toBeNull();
  });
});
