// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2021 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

const registerStateController: any = jest.fn();
const objectiveStoreMock: any = {
  registerStateController,
};

const getObjectiveStoreFromSagaContext = jest.fn();
jest.mock('../../../../src/hooks/get-objective-store-from-saga-context', () => ({
  getObjectiveStoreFromSagaContext,
}));

const getController = jest.fn((objectiveStore, CClass) => new CClass(objectiveStore));
jest.mock('../../../../src/store/lazy-loader', () => ({
  LazyLoader: {
    getController,
  },
}));

import { getControllerFromSagaContext, StateController } from '../../../../src';

class TestStateController extends StateController<number> {
  public constructor() {
    super(42);
  }

  public static override getName(): string {
    return 'Test';
  }
}

describe('get-controller-from-saga-context', () => {
  it('gets the controller from the saga context when there is an ObjectiveStore instance', () => {
    const generator = getControllerFromSagaContext(TestStateController);
    generator.next();
    const resultingContext = generator.next(objectiveStoreMock).value;
    expect(resultingContext).toBeInstanceOf(TestStateController);
  });

  it('returns null when there is no ObjectiveStore instance the saga context', () => {
    const generator = getControllerFromSagaContext(TestStateController);
    generator.next();
    const resultingContext = generator.next(null as any).value;
    expect(resultingContext).toBeNull();
  });
});
