// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

const registerStateController: any = jest.fn();
const reduxRegisterMock: any = {
  registerStateController,
};

const getRegisterFromSagaContext = jest.fn();
jest.mock('../../src/get-register-from-saga-context', () => ({
  getRegisterFromSagaContext,
}));

import { getControllerFromSagaContext, StateController } from '../../src';

class TestStateController extends StateController<number> {
  public constructor(register: any) {
    super(42, register);
  }

  public static getName(): string {
    return 'Test';
  }
}

describe('get-controller-from-saga-context', () => {
  it('gets the controller from the store context when there is a register', () => {
    const generator = getControllerFromSagaContext(TestStateController);
    generator.next();
    const resultingContext = generator.next(reduxRegisterMock).value;
    expect(resultingContext).toBeInstanceOf(TestStateController);
  });

  it('returns null when there is no register the store context', () => {
    const generator = getControllerFromSagaContext(TestStateController);
    generator.next();
    const resultingContext = generator.next(null as any).value;
    expect(resultingContext).toBeNull();
  });
});
